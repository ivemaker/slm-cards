import React from 'react';
import { 
  Layers, 
  ChevronRight, 
  FileText, 
  ArrowUp, 
  ArrowDown, 
  Trash2,
  Wand2,
  Sparkle
} from 'lucide-react';
import { Block, ProjectConfig } from '../types';

interface LayersPanelProps {
  blocks: Block[];
  selectedBlockId: string | null;
  draggedBlockId: string | null;
  dragOverBlockId: string | null;
  dragPosition: 'before' | 'after' | 'inside' | null;
  lang: 'en' | 'ru';
  setShowLayersPanel: (show: boolean) => void;
  setSelectedBlockId: (id: string | null) => void;
  toggleGroupCollapse: (id: string) => void;
  renameGroup: (id: string, name: string) => void;
  handleKeyboardMove: (id: string, dir: 'up' | 'down') => void;
  deleteGroupAndUnnest: (id: string) => void;
  deleteBlock: (id: string) => void;
  handleDragStart: (e: React.DragEvent, id: string) => void;
  handleDragOver: (e: React.DragEvent, id: string, isGroup: boolean) => void;
  handleDragLeave: () => void;
  handleDragEnd: () => void;
  handleDrop: (e: React.DragEvent, id: string) => void;
  handleDropAtRoot: (e: React.DragEvent) => void;
  setDragOverBlockId: (id: string | null) => void;
  setDragPosition: (pos: 'before' | 'after' | 'inside' | null) => void;
  
  // Custom design template parameters
  presets: any[];
  userTemplates: any[];
  currentConfig: ProjectConfig;
  onApplyTemplate: (preset: any) => void;
  onSaveCurrentStyle: () => void;
  onDeleteUserTemplate: (id: string, e: React.MouseEvent) => void;
  isDevMode?: boolean;
  onDeleteReadyTemplate?: (id: string) => void;
  onUpdateReadyTemplates?: (templates: any[]) => void;
  onAddReadyTemplate?: () => void;
}

export const LayersPanel: React.FC<LayersPanelProps> = ({
  blocks,
  selectedBlockId,
  draggedBlockId,
  dragOverBlockId,
  dragPosition,
  lang,
  setShowLayersPanel,
  setSelectedBlockId,
  toggleGroupCollapse,
  renameGroup,
  handleKeyboardMove,
  deleteGroupAndUnnest,
  deleteBlock,
  handleDragStart,
  handleDragOver,
  handleDragLeave,
  handleDragEnd,
  handleDrop,
  handleDropAtRoot,
  setDragOverBlockId,
  setDragPosition,
  
  presets,
  userTemplates,
  currentConfig,
  onApplyTemplate,
  onSaveCurrentStyle,
  onDeleteUserTemplate,
  isDevMode = false,
  onDeleteReadyTemplate,
  onUpdateReadyTemplates,
  onAddReadyTemplate,
}) => {
  const [isLayersExpanded, setIsLayersExpanded] = React.useState(true);
  const [isTemplatesExpanded, setIsTemplatesExpanded] = React.useState(true);

  // States for Ready-made templates drag and drop
  const [draggedPresetId, setDraggedPresetId] = React.useState<string | null>(null);
  const [dragOverPresetId, setDragOverPresetId] = React.useState<string | null>(null);
  const [editingPresetId, setEditingPresetId] = React.useState<string | null>(null);
  const [editingPresetName, setEditingPresetName] = React.useState('');

  const formatPrice = (price: number, currentLang: 'en' | 'ru') => {
    return currentLang === 'en' ? `$${price.toFixed(2)}` : `${Math.round(price * 75)} ₽`;
  };

  const renderTreeView = (items: Block[], depth = 0): React.ReactNode => {
    return items.map((block) => {
      const isSelected = selectedBlockId === block.id;
      const isGroup = block.type === 'group';
      const isCollapsed = block.groupContent?.isCollapsed ?? false;

      let titleSummary = '';
      if (block.type === 'profile') titleSummary = block.profileContent?.name || '';
      else if (block.type === 'socials') titleSummary = `${block.socialsContent?.links.length || 0} Links`;
      else if (block.type === 'text') titleSummary = block.textContent?.title || block.textContent?.body || '';
      else if (block.type === 'button') titleSummary = block.buttonContent?.label || '';
      else if (block.type === 'catalog-item') titleSummary = `${block.catalogItemContent?.title || ''} (${formatPrice(block.catalogItemContent?.price || 0, lang)})`;
      else if (block.type === 'category-header') titleSummary = block.categoryHeaderContent?.title || '';
      else if (block.type === 'spacer') titleSummary = `${block.spacerContent?.height || 'medium'} gap`;
      else if (block.type === 'group') titleSummary = block.groupContent?.title || (lang === 'en' ? 'Group Space' : 'Папка группы');

      const isDragOverTarget = dragOverBlockId === block.id;
      let dragHighlightStyle: React.CSSProperties = {};
      if (isDragOverTarget) {
        if (dragPosition === 'before') {
          dragHighlightStyle = { boxShadow: 'inset 0 4px 0 0 #18181b', transition: 'box-shadow 0.15s ease' };
        } else if (dragPosition === 'after') {
          dragHighlightStyle = { boxShadow: 'inset 0 -4px 0 0 #18181b', transition: 'box-shadow 0.15s ease' };
        } else if (dragPosition === 'inside') {
          dragHighlightStyle = { outline: '2px dashed #18181b', backgroundColor: '#f4f4f5' };
        }
      }

      return (
        <div key={block.id} className="space-y-1">
          <div
            draggable
            onDragStart={(e) => handleDragStart(e, block.id)}
            onDragOver={(e) => handleDragOver(e, block.id, isGroup)}
            onDragLeave={handleDragLeave}
            onDragEnd={handleDragEnd}
            onDrop={(e) => handleDrop(e, block.id)}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedBlockId(block.id);
            }}
            style={{ paddingLeft: `${depth * 14 + 10}px`, ...dragHighlightStyle }}
            className={`
              flex items-center justify-between p-2 rounded-lg border text-left transition-all cursor-grab active:cursor-grabbing select-none
              ${isSelected 
                ? 'bg-zinc-900 text-white border-zinc-950 shadow-sm font-medium' 
                : 'bg-zinc-50 border-zinc-200/70 text-zinc-800 hover:bg-zinc-100'
              }
              ${draggedBlockId === block.id ? 'opacity-40' : ''}
            `}
          >
            <div className="flex-grow min-w-0 pr-2 flex items-center gap-1.5 min-h-[32px]">
              {isGroup && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleGroupCollapse(block.id);
                  }}
                  className={`p-0.5 rounded hover:bg-zinc-750/20 transition-colors ${isSelected ? 'text-zinc-300 hover:text-white' : 'text-zinc-500'}`}
                >
                  <ChevronRight size={13} className={`transform transition-transform duration-200 ${isCollapsed ? 'rotate-0' : 'rotate-90'}`} />
                </button>
              )}

              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-[8px] uppercase font-mono tracking-wider font-bold opacity-60">
                    {block.type}
                  </span>
                </div>
                <p className="text-xs truncate font-medium mt-0.5 opacity-90 leading-tight">
                  {titleSummary || '—'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
              {isGroup && (
                <button
                  type="button"
                  onClick={() => {
                    const newTitle = window.prompt(
                      lang === 'en' ? 'Rename Group:' : 'Переименовать группу:',
                      block.groupContent?.title
                    );
                    if (newTitle !== null) {
                      renameGroup(block.id, newTitle);
                    }
                  }}
                  className={`p-1 rounded hover:bg-zinc-200/50 transition-colors ${isSelected ? 'text-zinc-350 hover:text-white hover:bg-zinc-805' : 'text-zinc-500'}`}
                  title="Rename Group"
                >
                  <FileText size={11} />
                </button>
              )}

              <button
                type="button"
                onClick={() => handleKeyboardMove(block.id, 'up')}
                className={`p-1 rounded hover:bg-zinc-200/50 transition-colors ${isSelected ? 'text-zinc-350 hover:text-white hover:bg-zinc-805' : 'text-zinc-500'}`}
                title="Move Up"
              >
                <ArrowUp size={11} />
              </button>
              <button
                type="button"
                onClick={() => handleKeyboardMove(block.id, 'down')}
                className={`p-1 rounded hover:bg-zinc-200/50 transition-colors ${isSelected ? 'text-zinc-350 hover:text-white hover:bg-zinc-850' : 'text-zinc-500'}`}
                title="Move Down"
              >
                <ArrowDown size={11} />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (isGroup) {
                    deleteGroupAndUnnest(block.id);
                  } else {
                    deleteBlock(block.id);
                  }
                }}
                className={`p-1 rounded transition-colors text-red-500 ${isSelected ? 'hover:bg-red-955 hover:text-red-300' : 'hover:bg-red-50'}`}
                title={isGroup ? "Delete Group (Keep blocks)" : "Delete Block"}
              >
                <Trash2 size={11} />
              </button>
            </div>
          </div>

          {isGroup && !isCollapsed && block.groupContent && block.groupContent.blocks.length > 0 && (
            <div className="border-l-2 border-zinc-200/60 ml-[18px] pl-2 space-y-1">
              {renderTreeView(block.groupContent.blocks, depth + 1)}
            </div>
          )}

          {isGroup && !isCollapsed && block.groupContent && block.groupContent.blocks.length === 0 && (
            <div 
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDragOverBlockId(block.id);
                setDragPosition('inside');
              }}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, block.id)}
              className={`border border-dashed border-zinc-200 hover:border-zinc-355 ml-[18px] py-1.5 rounded-lg text-center text-[10px] flex items-center justify-center transition-all ${dragOverBlockId === block.id && dragPosition === 'inside' ? 'bg-zinc-100 ring-2 ring-dashed ring-zinc-500 text-zinc-955 font-medium border-zinc-950' : 'bg-transparent text-zinc-400'}`}
            >
              {lang === 'en' ? 'Drop layers inside' : 'Перетащите блоки сюда'}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div id="layers_sidebar" className="w-full h-full bg-white p-4 flex flex-col space-y-3 text-left overflow-hidden">
      {/* Header */}
      <div className="border-b border-zinc-100 pb-2.5 flex items-center justify-between flex-shrink-0">
        <h3 className="font-bold text-xs tracking-tight text-zinc-950 flex items-center gap-1.5 select-none">
          <Layers size={13} className="text-zinc-600" />
          <span>{lang === 'en' ? "Design Studio Sidebar" : "Студийная боковая панель"}</span>
        </h3>
        <button 
          type="button"
          onClick={() => setShowLayersPanel(false)}
          className="text-zinc-400 hover:text-zinc-700 transition-colors text-[10px] font-mono leading-none border border-zinc-200 rounded px-1.5 py-0.5"
        >
          {lang === 'en' ? '✕ Hide' : '✕ Закрыть'}
        </button>
      </div>

      {/* Main double block container with total scrollability */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-none select-none">
        
        {/* BLOCK 1: FLOATING PAGE LAYERS */}
        <div className="border border-zinc-200/80 rounded-xl overflow-hidden bg-white shadow-sm">
          <div 
            onClick={() => setIsLayersExpanded(!isLayersExpanded)}
            className="flex items-center justify-between p-3 bg-zinc-50 hover:bg-zinc-100/70 border-b border-zinc-200/60 cursor-pointer select-none"
          >
            <h4 className="text-xs font-bold text-zinc-800 flex items-center gap-2">
              <Layers size={13} className="text-zinc-500" />
              <span>{lang === 'en' ? "Page Blocks Tree" : "Блоки и фреймы слоёв"}</span>
            </h4>
            <ChevronRight size={13} className={`transform transition-transform duration-200 text-zinc-400 ${isLayersExpanded ? 'rotate-90' : 'rotate-0'}`} />
          </div>

          {isLayersExpanded && (
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDropAtRoot}
              className="p-2 space-y-1 bg-white"
            >
              {blocks.length === 0 ? (
                <div className="py-8 border border-dashed border-zinc-100 rounded-lg text-center text-xs text-zinc-400 font-mono">
                  {lang === 'en' ? 'No blocks added yet' : 'Пока нет добавленных фреймов'}
                </div>
              ) : (
                renderTreeView(blocks)
              )}

              {/* Base layer */}
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedBlockId('main-bg');
                }}
                className={`
                  flex items-center justify-between p-2 rounded-lg border text-left transition-all cursor-pointer select-none mt-2
                  ${selectedBlockId === 'main-bg'
                    ? 'bg-zinc-900 text-white border-zinc-950 shadow-sm font-medium' 
                    : 'bg-[#ecfccb] border-[#bef264] text-lime-900 hover:bg-[#d9f99d]'
                  }
                `}
              >
                <div className="flex-grow min-w-0 pr-2 flex items-center gap-1.5 min-h-[30px]">
                  <Layers size={12} className={selectedBlockId === 'main-bg' ? 'text-zinc-300' : 'text-lime-700'} />
                  <div>
                    <span className="text-[8px] uppercase font-mono tracking-wider font-bold opacity-60 block leading-none">
                      {lang === 'en' ? 'Base Layer' : 'Основа'}
                    </span>
                    <span className="text-[11px] truncate font-bold opacity-90 mt-0.5">
                      🖼️ {lang === 'en' ? 'Main Background' : 'Главный бэкграунд'}
                    </span>
                  </div>
                </div>
                <div className={`text-[8px] font-mono opacity-80 px-1 py-0.5 rounded ${selectedBlockId === 'main-bg' ? 'bg-white/10' : 'bg-lime-500/30'}`}>
                  🔒
                </div>
              </div>

            </div>
          )}
        </div>

        {/* BLOCK 2: BEAUTIFUL DESIGN TEMPLATES (3-COLUMNS ASPECT-9/16) */}
        <div className="border border-zinc-200/80 rounded-xl overflow-hidden bg-white shadow-sm">
          <div 
            onClick={() => setIsTemplatesExpanded(!isTemplatesExpanded)}
            className="flex items-center justify-between p-3 bg-zinc-50 hover:bg-zinc-100/70 border-b border-zinc-200/60 cursor-pointer select-none"
          >
            <h4 className="text-xs font-bold text-zinc-800 flex items-center gap-2">
              <Wand2 size={13} className="text-zinc-500" />
              <span>{lang === 'en' ? "Design Templates" : "Глобальные шаблоны"}</span>
            </h4>
            <ChevronRight size={13} className={`transform transition-transform duration-200 text-zinc-400 ${isTemplatesExpanded ? 'rotate-90' : 'rotate-0'}`} />
          </div>

          {isTemplatesExpanded && (
            <div className="p-3 space-y-4">
              
              {/* Ready-made Templates Grid in 3 columns */}
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[9.5px] uppercase tracking-wider font-mono font-bold text-zinc-400">
                    {lang === 'en' ? "Ready-made Templates" : "Готовые шаблоны"}
                  </div>
                  {isDevMode && (
                    <div className="flex items-center gap-1.5">
                      {onAddReadyTemplate && (
                        <button
                          type="button"
                          onClick={() => onAddReadyTemplate()}
                          className="text-[9px] text-amber-600 hover:text-amber-800 font-bold flex items-center gap-0.5 transition-colors px-1.5 py-0.5 bg-amber-50 hover:bg-amber-100 rounded border border-amber-200 cursor-pointer"
                          title={lang === 'en' ? 'Add Current Style as Ready Template' : 'Добавить текущий стиль в готовые шаблоны'}
                        >
                          + {lang === 'en' ? 'Add' : 'Добавить'}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(presets, null, 2));
                          const downloadAnchor = document.createElement('a');
                          downloadAnchor.setAttribute("href", dataStr);
                          downloadAnchor.setAttribute("download", "custom_ready_templates.json");
                          document.body.appendChild(downloadAnchor);
                          downloadAnchor.click();
                          downloadAnchor.remove();
                        }}
                        className="text-[9px] text-zinc-600 hover:text-zinc-800 font-bold flex items-center gap-0.5 transition-colors px-1.5 py-0.5 bg-zinc-100 hover:bg-zinc-200 rounded border border-zinc-200 cursor-pointer"
                        title={lang === 'en' ? 'Export custom_ready_templates.json file' : 'Скачать файл готовых шаблонов custom_ready_templates.json'}
                      >
                        {lang === 'en' ? 'Export' : 'Экспорт'}
                      </button>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {presets.map((preset) => {
                    const isActive = currentConfig.designTemplate === preset.config?.designTemplate && 
                                     (preset.config?.theme ? currentConfig.theme === preset.config?.theme : true) &&
                                     currentConfig.mainBg?.lightConfig?.fillColor === preset.config?.mainBg?.lightConfig?.fillColor &&
                                     currentConfig.mainBg?.darkConfig?.fillColor === preset.config?.mainBg?.darkConfig?.fillColor;
                    return (
                      <div
                        key={preset.id}
                        role="button"
                        tabIndex={0}
                        draggable={isDevMode}
                        onDragStart={(e) => {
                          if (isDevMode) {
                            setDraggedPresetId(preset.id);
                            e.dataTransfer.effectAllowed = 'move';
                          }
                        }}
                        onDragOver={(e) => {
                          if (isDevMode && draggedPresetId && draggedPresetId !== preset.id) {
                            e.preventDefault();
                            setDragOverPresetId(preset.id);
                          }
                        }}
                        onDragLeave={() => {
                          if (isDevMode) setDragOverPresetId(null);
                        }}
                        onDrop={(e) => {
                          if (isDevMode && draggedPresetId && draggedPresetId !== preset.id && onUpdateReadyTemplates) {
                            e.preventDefault();
                            const fromIndex = presets.findIndex(p => p.id === draggedPresetId);
                            const toIndex = presets.findIndex(p => p.id === preset.id);
                            if (fromIndex >= 0 && toIndex >= 0) {
                              const newPresets = [...presets];
                              const [moved] = newPresets.splice(fromIndex, 1);
                              newPresets.splice(toIndex, 0, moved);
                              onUpdateReadyTemplates(newPresets);
                            }
                            setDraggedPresetId(null);
                            setDragOverPresetId(null);
                          }
                        }}
                        onDragEnd={() => {
                          if (isDevMode) {
                            setDraggedPresetId(null);
                            setDragOverPresetId(null);
                          }
                        }}
                        onClick={() => {
                          if (editingPresetId !== preset.id) onApplyTemplate(preset);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            if (editingPresetId !== preset.id) {
                              e.preventDefault();
                              onApplyTemplate(preset);
                            }
                          }
                        }}
                        className={`group relative flex flex-col items-center justify-between p-1 rounded-lg border text-center select-none outline-none focus-visible:ring-2 focus-visible:ring-purple-500 transition-all ${
                          editingPresetId !== preset.id ? 'cursor-pointer' : ''
                        } ${
                          isActive 
                            ? 'border-purple-600 bg-purple-50/10 ring-1 ring-purple-400/50' 
                            : 'border-zinc-200 hover:border-zinc-400 bg-zinc-50/40 hover:bg-zinc-50/80'
                        } ${
                          draggedPresetId === preset.id ? 'opacity-50' : ''
                        } ${
                          dragOverPresetId === preset.id ? 'ring-2 ring-blue-500 scale-105' : ''
                        }`}
                        title={lang === 'en' ? (preset.descriptionEn || preset.descriptionRu) : (preset.descriptionRu || preset.descriptionEn)}
                      >
                        {/* Square Aspect Mini Screen Preview */}
                        <div className={`w-full aspect-square rounded-md bg-gradient-to-tr ${preset.previewGradient || 'from-zinc-50 via-zinc-100 to-zinc-200'} relative overflow-hidden flex flex-col justify-between p-1 shadow-sm ${editingPresetId !== preset.id ? 'group-hover:scale-[1.03]' : ''} transition-all`}>
                          
                          {/* Mini Notch */}
                          <div className="w-1/2 h-1 bg-black/60 rounded-full mx-auto mt-0.5" />
                          
                          {/* Mini Layout representation: decorative simple lines */}
                          <div className="space-y-1 mx-0.5 my-auto pointer-events-none">
                            <div className="w-3/4 h-1 bg-white/40 rounded-[1px] mx-auto" />
                            <div className="w-1/2 h-1 bg-white/30 rounded-[1px] mx-auto" />
                            <div className="w-4 h-1 bg-white/50 rounded-full mx-auto mt-1" />
                          </div>

                          <div className="w-full flex justify-center pb-0.5">
                            {isActive && (
                              <span className="text-[8px] bg-purple-600 text-white rounded-full px-1 py-0.5 leading-none font-bold scale-90">
                                ✓
                              </span>
                            )}
                          </div>

                          {/* Delete button for ready templates in Developer Mode */}
                          {isDevMode && onDeleteReadyTemplate && editingPresetId !== preset.id && (
                            <button
                              type="button"
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                e.preventDefault(); 
                                onDeleteReadyTemplate(preset.id); 
                              }}
                              className="absolute top-1 right-1 bg-red-650 hover:bg-red-750 text-white rounded-full w-4 h-4 flex items-center justify-center text-[8px] transition-all font-bold z-10 hover:scale-110 shadow-md"
                              title={lang === 'en' ? 'Remove from ready templates' : 'Удалить из готовых шаблонов'}
                            >
                              ✕
                            </button>
                          )}
                        </div>

                        {/* Name (with double click to rename in dev mode) */}
                        <div 
                          className="w-full mt-1.5"
                          onDoubleClick={(e) => {
                            if (isDevMode && onUpdateReadyTemplates) {
                              e.stopPropagation();
                              setEditingPresetId(preset.id);
                              setEditingPresetName(lang === 'en' ? (preset.nameEn || preset.nameRu) : (preset.nameRu || preset.nameEn));
                            }
                          }}
                        >
                          {editingPresetId === preset.id ? (
                            <input
                              autoFocus
                              className="w-full text-[9px] font-semibold text-center text-zinc-900 border border-purple-500 rounded px-0.5 py-0.5 outline-none"
                              value={editingPresetName}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => setEditingPresetName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  if (editingPresetName.trim() && onUpdateReadyTemplates) {
                                    const newPresets = presets.map(p => {
                                      if (p.id === preset.id) {
                                        return {
                                          ...p,
                                          nameEn: lang === 'en' ? editingPresetName.trim() : p.nameEn,
                                          nameRu: lang === 'ru' ? editingPresetName.trim() : p.nameRu,
                                        };
                                      }
                                      return p;
                                    });
                                    onUpdateReadyTemplates(newPresets);
                                  }
                                  setEditingPresetId(null);
                                } else if (e.key === 'Escape') {
                                  setEditingPresetId(null);
                                }
                              }}
                              onBlur={() => {
                                if (editingPresetName.trim() && onUpdateReadyTemplates) {
                                  const newPresets = presets.map(p => {
                                    if (p.id === preset.id) {
                                      return {
                                        ...p,
                                        nameEn: lang === 'en' ? editingPresetName.trim() : p.nameEn,
                                        nameRu: lang === 'ru' ? editingPresetName.trim() : p.nameRu,
                                      };
                                    }
                                    return p;
                                  });
                                  onUpdateReadyTemplates(newPresets);
                                }
                                setEditingPresetId(null);
                              }}
                            />
                          ) : (
                            <span 
                              className="text-[9px] font-semibold text-zinc-800 truncate w-full block cursor-text"
                              title={isDevMode ? "Double-click to rename" : ""}
                            >
                              {(() => {
                                const name = lang === 'en' ? (preset.nameEn || preset.nameRu) : (preset.nameRu || preset.nameEn);
                                return name.length > 30 ? name.slice(0, 27) + '...' : name;
                              })()}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* USER TEMPLATES PANEL */}
              <div className="space-y-2 border-t border-zinc-100 pt-3">
                <div className="flex items-center justify-between">
                  <div className="text-[9.5px] uppercase tracking-wider font-mono font-bold text-zinc-400">
                    {lang === 'en' ? "My Templates" : "Мои шаблоны"}
                  </div>
                  <button
                    type="button"
                    onClick={onSaveCurrentStyle}
                    className="text-[9px] text-purple-600 hover:text-purple-800 font-bold flex items-center gap-0.5 transition-colors px-1.5 py-0.5 bg-purple-50 hover:bg-purple-100 rounded border border-purple-200"
                    title={lang === 'en' ? 'Save Current Style as Template' : 'Сохранить стиль текущего проекта'}
                  >
                    + {lang === 'en' ? 'Save' : 'Создать'}
                  </button>
                </div>

                {userTemplates.length === 0 ? (
                  <button
                    type="button"
                    onClick={onSaveCurrentStyle}
                    className="w-full border border-dashed border-zinc-200 hover:border-zinc-350 py-4 px-2 rounded-xl text-center cursor-pointer group hover:bg-zinc-50/50 transition-colors"
                  >
                    <div className="text-zinc-450 group-hover:text-purple-600 transition-colors flex flex-col items-center gap-1">
                      <Sparkle size={15} className="text-zinc-400/80 group-hover:animate-spin" />
                      <span className="text-[9.5px] font-bold leading-tight">
                        {lang === 'en' ? '+ Save Current Style' : '+ Сохранить стиль'}
                      </span>
                    </div>
                  </button>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {userTemplates.map((tpl) => {
                      const isActive = currentConfig.designTemplate === tpl.config?.designTemplate && 
                                       (tpl.config?.theme ? currentConfig.theme === tpl.config?.theme : true) &&
                                       currentConfig.mainBg?.lightConfig?.fillColor === tpl.config?.mainBg?.lightConfig?.fillColor &&
                                       currentConfig.mainBg?.darkConfig?.fillColor === tpl.config?.mainBg?.darkConfig?.fillColor;
                      return (
                        <div
                          key={tpl.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => onApplyTemplate(tpl)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              onApplyTemplate(tpl);
                            }
                          }}
                          className={`group relative flex flex-col items-center justify-between p-1 rounded-lg border text-center cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-purple-500 transition-all ${
                            isActive 
                              ? 'border-purple-600 bg-purple-50/10 ring-1 ring-purple-400/50' 
                              : 'border-zinc-200 hover:border-zinc-400 bg-zinc-50/40 hover:bg-zinc-50/80'
                          }`}
                          title={tpl.nameEn || tpl.nameRu}
                        >
                          {/* Square Aspect Mini Screen Preview */}
                          <div className={`w-full aspect-square rounded-md bg-gradient-to-tr ${tpl.previewGradient || 'from-zinc-50 via-zinc-100 to-zinc-200'} relative overflow-hidden flex flex-col justify-between p-1 shadow-sm group-hover:scale-[1.03] transition-all`}>
                            
                            {/* Mini Notch */}
                            <div className="w-1/2 h-1 bg-black/60 rounded-full mx-auto mt-0.5" />
                            
                            {/* Mini Layout representation: decorative simple lines */}
                            <div className="space-y-1 mx-0.5 my-auto pointer-events-none">
                              <div className="w-3/4 h-1 bg-white/40 rounded-[1px] mx-auto" />
                              <div className="w-1/2 h-1 bg-white/30 rounded-[1px] mx-auto" />
                            </div>

                            <div className="w-full flex justify-center pb-0.5">
                              {isActive && (
                                <span className="text-[8px] bg-purple-600 text-white rounded-full px-1 py-0.5 leading-none font-bold scale-90">
                                  ✓
                                </span>
                              )}
                            </div>

                            {/* Delete button for user templates */}
                            <button
                              type="button"
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                e.preventDefault(); 
                                onDeleteUserTemplate(tpl.id, e); 
                              }}
                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-red-650 hover:bg-red-750 text-white rounded-full w-4 h-4 flex items-center justify-center text-[8px] transition-all font-bold z-10 hover:scale-110"
                              title={lang === 'en' ? 'Remove' : 'Удалить'}
                            >
                              ✕
                            </button>
                          </div>

                          {/* Name */}
                          <span className="text-[9px] font-semibold text-zinc-800 truncate w-full mt-1.5 block">
                            {(() => {
                              const name = tpl.nameEn || tpl.nameRu;
                              return name.length > 30 ? name.slice(0, 27) + '...' : name;
                            })()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
