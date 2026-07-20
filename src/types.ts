/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TypographyTheme = 'modern' | 'serif' | 'mono';

export type FramePadding = 'none' | 'small' | 'medium' | 'large';
export type FrameRadius = 'none' | 'sm' | 'md' | 'lg' | 'full';

export interface SocialLink {
  platform: 'instagram' | 'twitter' | 'github' | 'linkedin' | 'email' | 'phone' | 'whatsapp' | 'telegram' | 'website';
  url: string;
}

export interface SocialsIconStyle {
  preset?: 'minimalist' | 'neon' | 'glassmorphic' | 'retro-synth' | 'corporate';
  borderWidth?: number;
  borderColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double';
  fillType?: 'color' | 'gradient' | 'none';
  fillColor?: string;
  fillOpacity?: number;
  gradientStart?: string;
  gradientEnd?: string;
  gradientAngle?: number;
  enableShadow?: boolean;
  shadowColor?: string;
  shadowBlur?: number;
  shadowIntensity?: number;
  colorType?: 'solid' | 'gradient';
  iconColor?: string;
  iconColorEnd?: string;
  borderRadius?: 'circle' | 'square' | 'rounded-lg' | 'squircle';
  enableGlare?: boolean;
  glareSpeed?: number;
  glareColor?: string;
  enableGlass?: boolean;
  glassThickness?: number;
  glassRefractiveIndex?: number;
  bezelWidth?: number;
  glassZoom?: number;
  glassPreset?: 'convex-circular' | 'convex-smooth' | 'concave' | 'ridge';
  glassShowSpecular?: boolean;
  enableBlur?: boolean;
  blurAmount?: number;
}

export interface ProfileContent {
  avatar: string;
  name: string;
  bio: string;
  avatarShape?: 'circle' | 'square' | 'rounded' | 'none';
  layout?: 'stacked' | 'row';
  align?: 'left' | 'center' | 'right';
  fullWidth?: boolean;
  showAvatar?: boolean;
  bgImage?: string;
  avatarSize?: number;
  avatarBorderEnabled?: boolean;
  avatarBorderColor?: string;
  avatarBorderWidth?: number;
  avatarBorderStyle?: 'solid' | 'dashed' | 'dotted' | 'double';
  avatarShadowEnabled?: boolean;
  avatarShadowBlur?: number;
  avatarShadowColor?: string;
  avatarShadowOpacity?: number;
  avatarShadowOffsetX?: number;
  avatarShadowOffsetY?: number;
  avatarGlowEnabled?: boolean;
  avatarGlowColor?: string;
  avatarGlowRadius?: number;
  avatarGlowIntensity?: number;
  avatarShimmerEnabled?: boolean;
  avatarShimmerSpeed?: number;
  avatarShimmerColor?: string;
  avatarShimmerWidth?: number;
  avatarShimmerInterval?: number;
  avatarGlassEnabled?: boolean;
  avatarGlassColor?: string;
  avatarGlassOpacity?: number;
  avatarGlassReflectIntensity?: number;
  avatarGlassType?: 'dome' | 'retro' | 'flat' | 'crystal';
  avatarGlassBlur?: number;
  avatarGlassAngle?: number;
  avatarSvgRaw?: string;
  avatarSvgColor?: string;
}

export interface TextContent {
  title: string;
  body: string;
}

export interface ButtonContent {
  label: string;
  url: string;
  variant: 'primary' | 'secondary' | 'outline';
}

export interface CatalogItemContent {
  id: string;
  image: string;
  title: string;
  description: string;
  price: number;
}

export interface DishContent {
  id: string;
  name: string;
  description: string;
  price: number;
  weight: string;
  buttonText?: string;
  image?: string;
  images: string[];
  imageLayout?: 'left' | 'center' | 'right';
  imageSize?: 'sm' | 'md' | 'lg';
  priceColor?: string;
  priceSize?: number;
  weightColor?: string;
  weightSize?: number;
  buttonSize?: number;
}

export interface ProductContent {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  buttonText: string;
  image?: string;
  images: string[];
  imageLayout?: 'left' | 'center' | 'right';
  imageSize?: 'sm' | 'md' | 'lg';
  priceColor?: string;
  priceSize?: number;
  oldPriceColor?: string;
  oldPriceSize?: number;
  buttonSize?: number;
}

export interface CategoryHeaderContent {
  title: string;
}

export interface SpacerContent {
  height: 'small' | 'medium' | 'large';
}

export type BlockType = 
  | 'profile'
  | 'socials'
  | 'text'
  | 'button'
  | 'catalog-item'
  | 'category-header'
  | 'spacer'
  | 'media'
  | 'group'
  | 'row-group'
  | 'dish'
  | 'product';

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
}

export interface MediaContent {
  items: MediaItem[];
  autoplay?: boolean;
  loop?: boolean;
  showControls?: boolean;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'auto';
  objectFit?: 'cover' | 'contain';
}

export interface GroupContent {
  title: string;
  isCollapsed?: boolean;
  blocks: Block[];
  layout?: 'stacked' | 'row';
}

export interface Block {
  id: string;
  type: BlockType;
  padding: FramePadding;
  bgColor: string; // Tailwind bg class
  textColor: string; // Tailwind text class
  borderRadius: FrameRadius;
  borderColor: string; // Tailwind border class
  borderWidth: 'none' | 'thin';
  fullWidth?: boolean;

  // Background Custom Fills
  fillType?: 'color' | 'image' | 'gradient';
  fillColor?: string; // Hex or CSS color or Tailwind bg color
  fillImage?: string; // Compressed Base64 image
  fillGradientPreset?: 'cosmic' | 'sunset' | 'ocean' | 'emerald' | 'bubblegum' | 'fire' | 'custom';
  fillGradientAnimated?: boolean;

  // Custom transparent background & border options
  bgOpacity?: number; // 0 to 100
  hasBorder?: boolean;
  borderStyleType?: 'solid' | 'dashed' | 'dotted' | 'double';
  borderWidthValue?: number; // width in px
  customBorderColor?: string; // Hex color code
  customCornersEnabled?: boolean;
  customCornersRadius?: number; // 1 to 30px

  // Custom dual-color gradients
  customGradientStart?: string;
  customGradientEnd?: string;
  customGradientAngle?: number;

  // Advanced Block Effects
  enableBlurEffect?: boolean;
  blurEffectAmount?: number; // 0 to 24px
  
  enableGlareEffect?: boolean;
  glareEffectSpeed?: number; // seconds
  glareEffectColor?: string; // Hex color for the shine

  enableGlowEffect?: boolean;
  glowEffectColor?: string; // Hex color for active pulsing glow
  glowEffectSpeed?: number; // seconds

  enableNoiseEffect?: boolean;
  noiseEffectOpacity?: number; // 0 to 100

  // Glass refraction properties (Стекло)
  enableGlassEffect?: boolean;
  glassThickness?: number; // 10 to 200
  refractiveIndex?: number; // 1.0 to 6.0
  bezelWidth?: number; // 2 to 60
  glassZoom?: number; // 0 to 100
  glassPreset?: 'convex-circular' | 'convex-smooth' | 'concave' | 'ridge';
  glassShowSpecular?: boolean;
  
  customShadow?: string;
  enableShadow?: boolean;
  shadowSize?: number;
  shadowIntensity?: number;
  enableHoverEffect?: boolean;
  hoverBorderColor?: string;

  // Contour glow and corner gradient glow settings
  borderGlowActive?: boolean;
  borderGlowColor?: string;
  borderGlowWidth?: number; // Spread / blur in px, e.g. 0 to 40px
  borderGlowOpacity?: number; // 0 to 100
  borderCornerGlowActive?: boolean;
  borderCornerColorTL?: string;
  borderCornerColorTR?: string;
  borderCornerColorBL?: string;
  borderCornerColorBR?: string;
  borderCornerLength?: number; // Corner segment length in px, e.g. 10px to 80px
  borderCornerStroke?: number; // Border thickness for corner fragment in px
  borderCornerGlowSpread?: number; // Corner glow blur spread in px, e.g. 0 to 30px
  borderCornerGlowOpacity?: number; // Corner glow opacity, 0 to 100

  customTextColor?: string;
  customTitleColor?: string;
  customDescColor?: string;
  customTitleFont?: string;
  customTitleFontSize?: number;
  customDescFont?: string;
  customDescFontSize?: number;
  customIconColor?: string;
  
  titleTextStyles?: TextStyles;
  descTextStyles?: TextStyles;

  // Text formatting
  textAlign?: 'left' | 'center' | 'right';
  textBold?: boolean;
  textItalic?: boolean;
  textUnderline?: boolean;
  textLineHeight?: number; // e.g. 1.0 to 2.0
  textLetterSpacing?: number; // e.g. -2 to 10 px
  
  // Text effects
  textShimmerEnabled?: boolean;
  textShimmerColor?: string; // highlight color
  textShimmerSpeed?: number; // speed in seconds
  textShimmerInterval?: number;
  textShimmerDirection?: 'left' | 'right';
  textShadowEnabled?: boolean;
  textShadowColor?: string;
  textShadowBlur?: number;
  textShadowOffsetX?: number;
  textShadowOffsetY?: number;
  textGlowEnabled?: boolean;
  textGlowColor?: string;
  textGlowRadius?: number;

  bgEffects?: BgEffect[];

  
  // Dynamic content depending on type
  profileContent?: ProfileContent;
  socialsContent?: { 
    links: SocialLink[];
    contactName?: string;
    phones?: { number: string; isPrimary: boolean }[];
    iconSize?: number;
    maxPerRow?: number;
    iconSpacing?: 'small' | 'medium' | 'large';
    layout?: 'stacked' | 'row';
    iconStyle?: SocialsIconStyle;
  };
  textContent?: TextContent;
  buttonContent?: ButtonContent;
  catalogItemContent?: CatalogItemContent;
  dishContent?: DishContent;
  productContent?: ProductContent;
  categoryHeaderContent?: CategoryHeaderContent;
  spacerContent?: SpacerContent;
  groupContent?: GroupContent;
  mediaContent?: MediaContent;
  rowBlocks?: Block[];
  mainBg?: MainBgConfig;
  tabletOverrides?: Partial<Block>;
  mobileOverrides?: Partial<Block>;
  darkOverrides?: Partial<Block>;

  config?: {
    price?: number;
    isEcomEnabled?: boolean;
  };
  animation?: {
    type: 'none' | 'fade' | 'slide';
    direction?: 'left' | 'bottom' | 'right';
    duration: number; // 200 - 1500ms
    delay: number;    // 0 - 500ms
  };
}

export interface TextStyles {
  textAlign?: 'left' | 'center' | 'right';
  textBold?: boolean;
  textItalic?: boolean;
  textUnderline?: boolean;
  textLineHeight?: number;
  textLetterSpacing?: number;
  
  textShimmerEnabled?: boolean;
  textShimmerColor?: string;
  textShimmerSpeed?: number;
  textShimmerInterval?: number;
  textShimmerDirection?: 'left' | 'right';
  
  textShadowEnabled?: boolean;
  textShadowColor?: string;
  textShadowBlur?: number;
  textShadowOffsetX?: number;
  textShadowOffsetY?: number;
  
  textGlowEnabled?: boolean;
  textGlowColor?: string;
  textGlowRadius?: number;
}

export interface TopoLayer {
  color: string;
  opacity?: number;
  image?: string | null;
  blur?: number;
  shadow?: boolean;
  shadowBlur?: number;
  shadowOpacity?: number;
  shadowAngle?: number;
  shadowDistance?: number;
}

export interface BgEffect {
  id: string;
  type: 'css-waves' | 'blob' | 'plasma' | 'chroma-lab' | 'flat-waves' | 'bezier-waves' | 'liquid-ripples' | 'origami-ribbon' | 'webgl-polylines' | 'neon-stream' | 'stars' | 'webgl-metaballs' | 'cyber-lines' | 'noise-topography' | 'vector-forms' | 'research-network' | 'geo-shapes' | 'floating-cubes' | 'clouds-3d';
  color: string;
  opacity: number;
  speed: number;
  position: 'top' | 'bottom';
  height: number;
  seed: number;
  amplitude?: number;
  blur?: number;
  isSpectrum?: boolean;
  spectrumColors?: string[];
  isGlare?: boolean;
  glareInterval?: number;
  complexity?: number;
  intensity?: number;
  isPaused?: boolean;
  plasmaColors?: string[];
  plasmaAlgorithm?: number;
  plasmaPreset?: string;
  plasmaScale?: number;
  plasmaTurbulence?: number;
  hue?: number;
  
  // Flat wave settings
  wavelength?: number;
  jitter?: number;
  shininess?: number;
  zoom?: number;
  topDown?: boolean;
  rotationX?: number;
  rotationY?: number;
  posY?: number;
  environmentReflection?: boolean;
  reflectionImageUrl?: string;

  // Bezier waves settings
  bezierWaves?: number;
  bezierWidth?: number;
  bezierAmplitude?: number;
  bezierHueStart?: number;
  bezierHueEnd?: number;
  bezierRotation?: number;

  // Liquid ripples (Interactive Waves) settings
  liquidGridX?: number;
  liquidGridY?: number;
  liquidSeparation?: number;
  liquidParticleSize?: number;
  liquidParticleColor?: string;
  liquidWaveSpeed?: number;
  liquidWaveFrequency?: number;
  liquidWaveAmplitude?: number;
  liquidCameraHeight?: number;
  liquidCameraDepth?: number;
  liquidBgGradientStart?: string;
  liquidBgGradientEnd?: string;

  // Origami Ribbon settings
  origamiComplexity?: number;
  origamiSize?: number;
  origamiFillHue?: number;
  origamiColorSpeed?: number;
  origamiAnimationSpeed?: number;
  origamiAmplitude?: number;
  origamiHeightOffset?: number;
  origamiScale?: number;
  origamiRotation?: number;
  origamiWireframe?: boolean;
  origamiShimmer?: boolean;
  origamiBgGradientStart?: string;
  origamiBgGradientEnd?: string;

  // WebGL Polylines settings
  polylineNx?: number;
  polylineNy?: number;
  polylineAngle?: number;
  polylineColorScheme?: 'ocean' | 'sunset' | 'forest' | 'neon' | 'default';
  polylineDarken?: number;
  polylineThickness?: number;

  // Neon Stream settings
  neonDensity?: number;
  neonSpeed?: number;
  neonLineWidth?: number;
  neonGlowRadius?: number;
  neonFlickerIntensity?: number;
  neonColorSpeed?: number;

  // Stars settings
  starCount?: number;
  starSize?: number;
  starSizeRandomness?: number;
  starColorRandomness?: number;
  starBrightness?: number;
  starBrightnessRandomness?: number;
  starGlow?: number;
  starGlowRandomness?: number;
  starRotationSpeedX?: number;
  starRotationSpeedY?: number;
  starRotationSpeedZ?: number;
  starFov?: number;
  starMouseRotation?: boolean;

  // WebGL Metaballs settings
  numMetaballs?: number;
  minRadius?: number;
  maxRadius?: number;
  glowRadius?: number;
  outline?: boolean;
  outlineWidth?: number;
  outlineColor?: string;
  fill?: boolean;
  mouseInteraction?: boolean;
  shadow?: boolean;
  shadowBlur?: number;
  shadowOpacity?: number;
  shadowAngle?: number;
  shadowDistance?: number;
  colorOpacity?: number;
  image?: string | null;
  imageBlur?: number;
  metaballsBgColor?: string;
  metaballsUseBgImage?: boolean;
  metaballsBgImage?: string;

  // Cyber Lines settings
  count?: number;
  minWidth?: number;
  maxWidth?: number;
  minSpeed?: number;
  maxSpeed?: number;
  hueDif?: number;
  glow?: number;
  clickToChangeColor?: boolean;

  // Noise Topography and Clouds 3D settings
  scale?: number;
  topoColors?: TopoLayer[];
  cloudCount?: number;
  backgroundColor?: string;
  bgGradientColor1?: string;
  bgGradientColor2?: string;
  cameraHeight?: number;
  scrollCameraStart?: number;
  scrollCameraEnd?: number;
  scrollLimit?: number;
  fogColor?: string;
  fogNear?: number;
  fogFar?: number;
  cloudImage?: string;

  // Vector Forms settings
  cols?: number;
  rows?: number;
  bgColor?: string;
  shapeWidth?: number;
  shapeHeight?: number;
  strokeWidth?: number;
  duration?: number;
  maskType?: 'hexagon' | 'circle' | 'square' | 'none';
  patternType?: 'circles' | 'star' | 'cross' | 'triangle';
  colorHueStart?: number;
  colorHueStep?: number;
  colorSaturation?: number;
  colorLightness?: number;
  overlapMode?: boolean;

  // Research Network settings
  maxCircles?: number;
  maxCirclesBg?: number;
  colors?: string[];
  bgColors?: string[];
  radMin?: number;
  radMax?: number;
  radThreshold?: number;
  filledCircle?: number;
  concentricCircle?: number;
  speedMin?: number;
  speedMax?: number;
  linkDist?: number;
  lineBorder?: number;
  circleBorder?: number;
  maxOpacity?: number;

  // Geo Shapes settings
  gridSize?: number;
  size?: number;
  fallSpeed?: number;
  fallDirection?: number;
  rotationSpeed?: number;
  randomness?: number;

  // Floating Cubes settings
  cubesCount?: number;
  minSize?: number;
  maxSize?: number;
  shapes?: string[];
  tints?: { color: string; shading: string }[];

  // CSS Waves settings
  cssWavesSpeed?: number;
  cssWavesBgGradientStart?: string;
  cssWavesBgGradientEnd?: string;
  cssWavesTopOpacity?: number;
  cssWavesMiddleOpacity?: number;
  cssWavesBottomOpacity?: number;
  cssWavesTopColor?: string;
  cssWavesMiddleColor?: string;
  cssWavesBottomColor?: string;
  cssWavesTopYOffset?: number;
  cssWavesMiddleYOffset?: number;
  cssWavesBottomYOffset?: number;
  cssWavesCameraTilt?: number;
  cssWavesCameraYaw?: number;
  cssWavesTopAmplitude?: number;
  cssWavesTopWavelength?: number;
  cssWavesMiddleAmplitude?: number;
  cssWavesMiddleWavelength?: number;
  cssWavesBottomAmplitude?: number;
  cssWavesBottomWavelength?: number;
}

export interface CssWavesSettings {
  speedMultiplier: number;
  bgGradientStart: string;
  bgGradientEnd: string;
  topOpacity: number;
  middleOpacity: number;
  bottomOpacity: number;
  topColor: string;
  middleColor: string;
  bottomColor: string;
  topYOffset: number;       // Вертикальное смещение верхней волны
  middleYOffset: number;    // Вертикальное смещение средней волны
  bottomYOffset: number;    // Вертикальное смещение нижней волны
  cameraTilt: number;       // Перемещение камеры вверх/вниз (-1200px до +1200px)
  cameraYaw: number;        // Вращение камеры по оси Z (0-360°)
  topAmplitude: number;     // Высота гребня верхней волны (0-70)
  topWavelength: number;    // Длина/количество волн верхней волны
  middleAmplitude: number;  // Высота гребня средней волны
  middleWavelength: number; // Длина средней волны
  bottomAmplitude: number;  // Высота гребня нижней волны
  bottomWavelength: number; // Длина нижней волны
  opacity?: number;         // Параметр непрозрачности
}

export interface StarsSettings {
  starCount: number;
  starSize: number;
  sizeRandomness: number;
  baseColor: string;
  colorRandomness: number;
  brightness: number;
  brightnessRandomness: number;
  glow: number;
  glowRandomness: number;
  speed: number;
  rotationSpeedX: number;
  rotationSpeedY: number;
  rotationSpeedZ: number;
  fov: number;
  mouseRotation: boolean;
  opacity?: number;
}

export interface PolylineSettings {
  nx: number;
  ny: number;
  angle: number;
  colorScheme: 'ocean' | 'sunset' | 'forest' | 'neon' | 'default';
  darken: number;
  thickness: number;
  speed: number;
  opacity?: number;
}

export interface NeonStreamSettings {
  density: number;
  speed: number;
  lineWidth: number;
  glowRadius: number;
  flickerIntensity: number;
  colorSpeed: number;
  opacity?: number;
}

export interface LiquidSettings {
  gridX: number;
  gridY: number;
  separation: number;
  particleSize: number;
  particleColor: string;
  waveSpeed: number;
  waveFrequency: number;
  waveAmplitude: number;
  cameraHeight: number;
  cameraDepth: number;
  bgGradientStart: string;
  bgGradientEnd: string;
  opacity?: number;
}

export interface CosmicPlasmaSettings {
  speed: number;
  complexity: number;
  intensity: number;
  opacity: number;
  blur: number;
  isPaused: boolean;
  plasmaAlgorithm: number;
  scale: number;
  turbulence: number;
  plasmaColors: string[];
}

export interface BgSettings {
  fillType?: 'color' | 'image' | 'gradient';
  fillColor?: string;
  fillImage?: string;
  fillImageBlur?: number;
  fillGradientPreset?: 'cosmic' | 'sunset' | 'ocean' | 'emerald' | 'bubblegum' | 'fire';
  fillGradientAnimated?: boolean;
  effects?: BgEffect[];
}

export interface MainBgConfig {
  theme?: 'light' | 'dark';
  syncThemes?: boolean;
  lightConfig?: BgSettings;
  darkConfig?: BgSettings;
  blockSpacing?: number;
}

export interface ProjectConfig {
  username: string;
  customDomain: string;
  isCustomDomainActive: boolean;
  theme: TypographyTheme;
  lang: 'en' | 'ru';
  templateType: 'business' | 'restaurant' | 'catalog';
  orderDestinationType: 'whatsapp' | 'telegram';
  orderDestinationValue: string;
  blocks: Block[];
  views: number;
  clicks: number;
  conversions: number;
  mainBg?: MainBgConfig;
  designTemplate?: 'none' | 'chroma-lab';
  appliedTemplateId?: string;
  blockDefaults?: Partial<Block>;
  blockTypeDefaults?: Record<string, Partial<Block>>;
}

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}
