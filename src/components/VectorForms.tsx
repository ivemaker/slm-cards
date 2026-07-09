import React from 'react';

export interface FormsSettings {
  cols: number;
  rows: number;
  bgColor: string;
  shapeWidth: number;
  shapeHeight: number;
  strokeWidth: number;
  duration: number;
  maskType: 'hexagon' | 'circle' | 'square' | 'none';
  patternType: 'circles' | 'star' | 'cross' | 'triangle';
  colorHueStart: number;
  colorHueStep: number;
  colorSaturation: number;
  colorLightness: number;
  overlapMode: boolean;
  isPaused?: boolean;
}

interface VectorFormsProps {
  settings?: Partial<FormsSettings>;
}

const DEFAULT_SETTINGS: FormsSettings = {
  cols: 7,
  rows: 4,
  bgColor: '#0a0a0a',
  shapeWidth: 130,
  shapeHeight: 130,
  strokeWidth: 2,
  duration: 4.5,
  maskType: 'hexagon',
  patternType: 'circles',
  colorHueStart: 210,
  colorHueStep: 30,
  colorSaturation: 90,
  colorLightness: 55,
  overlapMode: true
};

export const VectorForms: React.FC<VectorFormsProps> = ({ settings: customSettings }) => {
  const settings = { ...DEFAULT_SETTINGS, ...customSettings };
  const {
    cols,
    rows,
    bgColor,
    shapeWidth,
    shapeHeight,
    strokeWidth,
    duration,
    maskType,
    patternType,
    colorHueStart,
    colorHueStep,
    colorSaturation,
    colorLightness,
    overlapMode,
    isPaused = false,
  } = settings;

  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push({ r, c });
    }
  }

  const getClipPath = () => {
    switch (maskType) {
      case 'hexagon':
        return 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)';
      case 'circle':
        return 'circle(50% at 50% 50%)';
      case 'square':
        return 'inset(0% round 8px)';
      case 'none':
      default:
        return 'none';
    }
  };

  const renderPattern = (beginDelay: number, strokeColor: string) => {
    const center = "50 57.5";
    
    switch (patternType) {
      case 'circles':
        return (
          <circle cx="50" cy="57.5" r={isPaused ? "40" : "0"} fill="none" stroke={strokeColor} strokeWidth={strokeWidth}>
            {!isPaused && <animate attributeName="r" repeatCount="indefinite" dur={`${duration}s`} begin={`${beginDelay}s`} from="0" to="80" />}
          </circle>
        );
      case 'star':
        return (
          <polygon points={isPaused ? "50 7, 62 40, 97 40, 69 61, 79 94, 50 74, 20 94, 30 61, 2 40, 37 40" : `${center}, ${center}, ${center}, ${center}`} fill="none" stroke={strokeColor} strokeWidth={strokeWidth}>
            {!isPaused && <animate attributeName="points" repeatCount="indefinite" dur={`${duration}s`} begin={`${beginDelay}s`}
              from={`${center}, ${center}, ${center}, ${center}, ${center}, ${center}, ${center}, ${center}, ${center}, ${center}`}
              to="50 7, 62 40, 97 40, 69 61, 79 94, 50 74, 20 94, 30 61, 2 40, 37 40" />}
          </polygon>
        );
      case 'cross':
        return (
          <polygon points={isPaused ? "50 -10, 110 57.5, 50 125, -10 57.5" : `${center}, ${center}, ${center}, ${center}`} fill="none" stroke={strokeColor} strokeWidth={strokeWidth}>
            {!isPaused && <animate attributeName="points" repeatCount="indefinite" dur={`${duration}s`} begin={`${beginDelay}s`}
              from={`${center}, ${center}, ${center}, ${center}`}
              to="50 -10, 110 57.5, 50 125, -10 57.5" />}
          </polygon>
        );
      case 'triangle':
      default:
        return (
          <polygon points={isPaused ? "50 -75, 175 126, -75 126" : "50 57.5, 50 57.5, 50 57.5"} fill="none" stroke={strokeColor} strokeWidth={strokeWidth}>
            {!isPaused && <animate attributeName="points" repeatCount="indefinite" dur={`${duration}s`} begin={`${beginDelay}s`}
              from="50 57.5, 50 57.5, 50 57.5"
              to="50 -75, 175 126, -75 126" />}
          </polygon>
        );
    }
  };

  const layers = Array.from({ length: 4 }).map((_, k) => {
    const hue = (colorHueStart + k * colorHueStep) % 360;
    const color = `hsl(${hue}, ${colorSaturation}%, ${colorLightness}%)`;
    const delay = (k * (duration / 4)).toFixed(2);
    return { color, delay: parseFloat(delay) };
  });

  return (
    <div 
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none flex items-center justify-center select-none"
      style={{ backgroundColor: bgColor }}
    >
      <div 
        className="relative"
        style={{
          width: `${cols * shapeWidth + (overlapMode && maskType === 'hexagon' ? shapeWidth * 0.5 : 0)}px`,
          height: `${rows * (overlapMode && maskType === 'hexagon' ? shapeHeight * 0.75 : shapeHeight) + (overlapMode && maskType === 'hexagon' ? shapeHeight * 0.25 : 0)}px`,
        }}
      >
        {cells.map(({ r, c }, index) => {
          let left = c * shapeWidth;
          let top = r * shapeHeight;

          if (overlapMode && maskType === 'hexagon') {
            top = r * shapeHeight * 0.75;
            left = c * shapeWidth + (r % 2 === 1 ? shapeWidth * 0.5 : 0);
          }

          return (
            <div
              key={`${r}-${c}-${index}`}
              className="absolute transition-all duration-500 ease-out"
              style={{
                width: `${shapeWidth}px`,
                height: `${shapeHeight}px`,
                left: `${left}px`,
                top: `${top}px`,
                clipPath: getClipPath(),
                WebkitClipPath: getClipPath(),
              }}
            >
              <svg viewBox="0 0 100 115" preserveAspectRatio="xMidYMin slice" className="w-full h-full">
                {layers.map((layer, k) => (
                  <React.Fragment key={k}>
                    {renderPattern(layer.delay, layer.color)}
                  </React.Fragment>
                ))}
              </svg>
            </div>
          );
        })}
      </div>
    </div>
  );
};
