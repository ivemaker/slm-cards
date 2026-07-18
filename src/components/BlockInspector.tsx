import React from 'react';
import { 
  Sparkle, 
  User, 
  Share2, 
  Type, 
  MousePointerClick, 
  ShoppingBag, 
  FolderHeart, 
  ArrowUpDown, 
  FolderPlus,
  RefreshCcw,
  FileText
} from 'lucide-react';
import { Block, ProjectConfig, FramePadding, FrameRadius } from '../types';
import { compressImage } from '../utils';
import { useDev } from '../context/DevContext';

interface BlockInspectorProps {
  focusedBlock: Block | null;
  selectedBlockId: string | null;
  viewMode: 'desktop' | 'mobile' | 'tablet';
  config: ProjectConfig;
  updateBlocks: (blocks: Block[]) => void;
  lang: 'en' | 'ru';
  isCompressing: boolean;
  handleImageUpload: (file: File, blockId: string, type: 'profile' | 'catalog') => void;
  updateFocusedBlock: (updateFn: (b: Block) => Partial<Block>) => void;
  setSelectedBlockId: (id: string | null) => void;
  translations: any;
}

import { MainBgInspector } from './inspectors/MainBgInspector';
import { ProfileInspector } from './inspectors/ProfileInspector';
import { SocialsInspector } from './inspectors/SocialsInspector';
import { TextInspector } from './inspectors/TextInspector';
import { ButtonInspector } from './inspectors/ButtonInspector';
import { CatalogItemInspector } from './inspectors/CatalogItemInspector';
import { CategoryHeaderInspector } from './inspectors/CategoryHeaderInspector';
import { SpacerInspector } from './inspectors/SpacerInspector';
import { GroupInspector } from './inspectors/GroupInspector';
import { StyleAccordion } from './inspectors/StyleAccordion';
import { MediaInspector } from './inspectors/MediaInspector';

export const BlockInspector: React.FC<BlockInspectorProps> = ({
  focusedBlock,
  selectedBlockId,
  viewMode,
  config,
  updateBlocks,
  lang,
  isCompressing,
  handleImageUpload,
  updateFocusedBlock,
  setSelectedBlockId,
  translations,
}) => {
  const [localStorageUploading, setLocalStorageUploading] = React.useState(false);
  const { activeProjectId, projects } = useDev();
  const activeProject = projects.find(p => p.id === activeProjectId);

  if (!focusedBlock || !selectedBlockId) {
    return (
      <div className="space-y-4">
        {activeProject && (
          <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-between gap-3 text-white">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shrink-0" />
              <div className="min-w-0">
                <p className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider">
                  {lang === 'en' ? 'Active Project:' : 'Активный проект:'}
                </p>
                <h4 className="text-xs font-bold truncate text-white">
                  {activeProject.name}
                </h4>
              </div>
            </div>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border flex items-center gap-1 shrink-0 ${
              activeProject.plan === 'premium'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/25'
                : activeProject.plan === 'unpaid'
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/25'
                : 'bg-zinc-800 text-zinc-450 border-zinc-700'
            }`}>
              {activeProject.plan === 'premium' ? '👑 Premium' : activeProject.plan === 'unpaid' ? 'Unpaid' : 'Standard'}
            </span>
          </div>
        )}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm border-dashed text-center space-y-3.5 flex flex-col items-center justify-center min-h-[220px]">
          <Sparkle size={22} className="text-zinc-400 animate-pulse" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-zinc-900 tracking-tight uppercase">
              {lang === 'en' ? 'Click Block to Edit' : 'Коснитесь, чтобы изменить'}
            </h4>
            <p className="text-[10.5px] text-zinc-500 font-normal leading-relaxed max-w-[210px] mx-auto">
              {lang === 'en' 
                ? 'Select any block directly inside the smartphone screen simulator to edit its content details, paddings, and styles.' 
                : 'Выберите любой блок в симуляторе телефона, чтобы настроить его текст, ссылки и внешний вид.'
              }
            </p>
          </div>
        </div>
      </div>
    );
  }

  const mainBg = (focusedBlock as any);
  const syncThemes = mainBg.syncThemes ?? true;
  const theme = mainBg.theme || 'light';
  const lightConfig = mainBg.lightConfig || {};
  const darkConfig = mainBg.darkConfig || {};
  
  const activeSettings = (syncThemes || theme === 'light') ? lightConfig : darkConfig;
  const updateActiveSettings = (newSettings: any) => {
    if (syncThemes) {
      updateFocusedBlock(() => ({
        mainBg: { ...mainBg, lightConfig: newSettings, darkConfig: newSettings }
      }));
    } else if (theme === 'light') {
      updateFocusedBlock(() => ({
        mainBg: { ...mainBg, lightConfig: newSettings }
      }));
    } else {
      updateFocusedBlock(() => ({
        mainBg: { ...mainBg, darkConfig: newSettings }
      }));
    }
  };

  const renderContentEditor = () => {
    switch (focusedBlock.type) {
      case 'main-bg':
        return (
          <MainBgInspector
            focusedBlock={focusedBlock}
            lang={lang}
            syncThemes={syncThemes}
            theme={theme}
            activeSettings={activeSettings}
            updateFocusedBlock={updateFocusedBlock}
            updateActiveSettings={updateActiveSettings}
            setLocalStorageUploading={setLocalStorageUploading}
            localStorageUploading={localStorageUploading}
          />
        );
      case 'profile':
        return (
          <ProfileInspector
            viewMode={viewMode}
            focusedBlock={focusedBlock}
            lang={lang}
            translations={translations}
            updateFocusedBlock={updateFocusedBlock}
            handleImageUpload={handleImageUpload}
            isCompressing={isCompressing}
            setLocalStorageUploading={setLocalStorageUploading}
            localStorageUploading={localStorageUploading}
            isHeaderSection={config.blocks.find(b => b.type === 'profile')?.id === focusedBlock.id}
          />
        );
      case 'socials':
        return <SocialsInspector focusedBlock={focusedBlock} lang={lang} updateFocusedBlock={updateFocusedBlock} />;
      case 'text':
        return <TextInspector focusedBlock={focusedBlock} lang={lang} translations={translations} updateFocusedBlock={updateFocusedBlock} />;
      case 'button':
        return <ButtonInspector focusedBlock={focusedBlock} lang={lang} translations={translations} updateFocusedBlock={updateFocusedBlock} />;
      case 'catalog-item':
        return (
          <CatalogItemInspector
            focusedBlock={focusedBlock}
            lang={lang}
            updateFocusedBlock={updateFocusedBlock}
            handleImageUpload={handleImageUpload}
            isCompressing={isCompressing}
          />
        );
      case 'category-header':
        return <CategoryHeaderInspector focusedBlock={focusedBlock} lang={lang} updateFocusedBlock={updateFocusedBlock} />;
      case 'spacer':
        return <SpacerInspector focusedBlock={focusedBlock} translations={translations} updateFocusedBlock={updateFocusedBlock} />;
      case 'group':
        return <GroupInspector focusedBlock={focusedBlock} lang={lang} updateFocusedBlock={updateFocusedBlock} />;
      case 'media':
        return <MediaInspector focusedBlock={focusedBlock} lang={lang} updateFocusedBlock={updateFocusedBlock} />;
      default:
        return null;
    }
  };

  return (
    <div id="focused_frame_editor" className="bg-zinc-950 text-white p-5 rounded-2xl border border-zinc-900 shadow-2xl lg:p-0 lg:rounded-none lg:border-none lg:shadow-none space-y-4 text-left">
      {activeProject && (
        <div className="p-3.5 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shrink-0" />
            <div className="min-w-0">
              <p className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider">
                {lang === 'en' ? 'Active Project:' : 'Активный проект:'}
              </p>
              <h4 className="text-xs font-bold truncate text-white">
                {activeProject.name}
              </h4>
            </div>
          </div>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border flex items-center gap-1 shrink-0 ${
            activeProject.plan === 'premium'
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/25'
              : activeProject.plan === 'unpaid'
              ? 'bg-rose-500/10 text-rose-400 border-rose-500/25'
              : 'bg-zinc-800 text-zinc-450 border-zinc-700'
          }`}>
            {activeProject.plan === 'premium' ? '👑 Premium' : activeProject.plan === 'unpaid' ? 'Unpaid' : 'Standard'}
          </span>
        </div>
      )}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
        <div>
          <span className="text-[9px] font-mono text-zinc-500 tracking-wider uppercase font-bold text-zinc-400">
            {selectedBlockId === 'main-bg' 
              ? (lang === 'en' ? 'Base Style Layer' : 'Главный системный слой')
              : `Configuring Frame #${selectedBlockId.slice(-4)}`
            }
          </span>
          <h4 className="font-bold text-base uppercase tracking-tight text-orange-500 mt-0.5">
            {selectedBlockId === 'main-bg'
              ? (lang === 'en' ? 'Main Background' : 'Главный бэкграунд')
              : `${translations.editBlock} (${focusedBlock.type})`
            }
          </h4>
        </div>
        <button
          type="button"
          onClick={() => setSelectedBlockId(null)}
          className="text-[10px] text-zinc-400 hover:text-white transition-colors"
        >
          ✕ Close
        </button>
      </div>

      <div className="space-y-4">
        {renderContentEditor()}
      </div>

      {focusedBlock.type !== 'main-bg' && (
        <StyleAccordion
          focusedBlock={focusedBlock}
          lang={lang}
          updateFocusedBlock={updateFocusedBlock}
        />
      )}
    </div>
  );
};

