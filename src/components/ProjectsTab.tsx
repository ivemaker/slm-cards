import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useDev, MockProject } from '../context/DevContext';
import { useToast } from '../context/ToastContext';
import { 
  Plus, 
  Trash2, 
  Settings,
  Sparkles, 
  User, 
  UtensilsCrossed, 
  Layers, 
  Folder, 
  X, 
  ChevronRight, 
  AlertCircle 
} from 'lucide-react';

interface ProjectsTabProps {
  lang: 'en' | 'ru';
}

const compressAvatar = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        const maxSide = 512;
        if (width > maxSide || height > maxSide) {
          if (width > height) {
            height = Math.round((height * maxSide) / width);
            width = maxSide;
          } else {
            width = Math.round((width * maxSide) / height);
            height = maxSide;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL(file.type);
        resolve(dataUrl);
      };
      img.onerror = (err) => {
        reject(err);
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = (err) => {
      reject(err);
    };
    reader.readAsDataURL(file);
  });
};

export const ProjectsTab: React.FC<ProjectsTabProps> = ({ lang }) => {
  const { 
    projects, 
    setActiveProjectId, 
    createProject, 
    deleteProject, 
    setActiveTab 
  } = useDev();

  const { success: toastSuccess } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<MockProject['type']>('personal_card');
  const [plan, setPlan] = useState<MockProject['plan']>('basic');
  const [layout, setLayout] = useState<MockProject['layout']>('classic');
  const [themeStyle, setThemeStyle] = useState('cosmic');
  const [avatar, setAvatar] = useState<string>('');
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState('');
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  const openModal = () => {
    setName('');
    setDescription('');
    setType('personal_card');
    setPlan('basic');
    setLayout('classic');
    setThemeStyle('cosmic');
    setAvatar('');
    setIsCompressing(false);
    setError('');
    setIsModalOpen(true);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(lang === 'en' ? 'Project name is required' : 'Имя проекта обязательно');
      return;
    }
    createProject(name.trim(), type, plan, avatar || undefined, description.trim() || undefined, layout, themeStyle);
    setIsModalOpen(false);
    toastSuccess(lang === 'en' ? 'Project successfully created' : 'Проект успешно создан');
    setActiveTab('editor');
  };

  const handleEditProject = (projId: string) => {
    setActiveProjectId(projId);
    setActiveTab('editor');
  };

  const handleOpenAnalytics = (projId: string) => {
    setActiveProjectId(projId);
    setActiveTab('dashboard');
  };

  return (
    <div className="flex-1 w-full px-6 sm:px-8 md:px-12 py-10 animate-fade-in relative z-10 text-white min-h-full bg-zinc-950">
      
      {/* Top Header Section */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-900 pb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400">
              <Folder className="w-5 h-5 stroke-[1.5]" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
              {lang === 'en' ? 'My Projects' : 'Мои проекты'}
            </h2>
          </div>
          <p className="text-sm text-zinc-500 mt-2 max-w-xl font-normal leading-relaxed">
            {lang === 'en' 
              ? 'Manage and design your interactive digital cards, smart menus, and catalog portfolios.' 
              : 'Управляйте и настраивайте свои интерактивные визитки, меню и каталоги.'}
          </p>
        </div>
      </div>

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Sleek Interactive Create New Project Card - Centered Content */}
        <button
          onClick={openModal}
          id="btn-create-project-trigger"
          className="group h-[210px] border border-dashed border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/15 rounded-2xl flex flex-col items-center justify-center p-6 transition-all duration-300 bg-transparent cursor-pointer text-center relative overflow-hidden"
        >
          <div className="w-12 h-12 mb-4 bg-zinc-900/60 border border-zinc-850 group-hover:border-zinc-700 rounded-full flex items-center justify-center text-zinc-500 group-hover:text-zinc-200 group-hover:bg-zinc-900 transition-all duration-300 shadow-sm">
            <Plus className="w-6 h-6 stroke-[1.5]" />
          </div>
          <div>
            <span className="block text-sm font-semibold text-zinc-400 group-hover:text-zinc-200 transition-colors duration-300">
              {lang === 'en' ? 'Create New Project' : 'Создать новый проект'}
            </span>
            <span className="block mt-2 text-xs text-zinc-600 group-hover:text-zinc-500 max-w-[240px] leading-normal transition-colors duration-300 mx-auto">
              {lang === 'en' ? 'Choose from our professional layout templates' : 'Начните с готового профессионального шаблона'}
            </span>
          </div>
        </button>

        {/* Existing Projects */}
        {projects.map((project) => {
          return (
            <div 
              key={project.id}
              id={`project-card-${project.id}`}
              onClick={() => handleEditProject(project.id)}
              className="h-[210px] bg-zinc-900/20 backdrop-blur-md border border-zinc-900 hover:border-zinc-800 rounded-2xl p-6 hover:bg-zinc-900/40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)] transition-all duration-300 flex flex-col justify-between group relative overflow-hidden cursor-pointer"
            >
              {/* Top part of project card */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${
                      project.type === 'personal_card' 
                        ? 'bg-blue-500/5 border-blue-500/10 text-blue-400' 
                        : project.type === 'menu' 
                        ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-400'
                        : 'bg-purple-500/5 border-purple-500/10 text-purple-400'
                    }`}>
                      {project.type === 'personal_card' && <User className="w-4.5 h-4.5 stroke-[1.5]" />}
                      {project.type === 'menu' && <UtensilsCrossed className="w-4.5 h-4.5 stroke-[1.5]" />}
                      {project.type === 'catalog' && <Layers className="w-4.5 h-4.5 stroke-[1.5]" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-zinc-200 group-hover:text-white transition-colors truncate text-base" title={project.name}>
                        {project.name}
                      </h3>
                      <p className="text-[10px] text-zinc-500 mt-0.5 font-mono">
                        {lang === 'en' ? 'Created:' : 'Создан:'} {project.createdAt}
                      </p>
                    </div>
                  </div>

                  {/* Refined Small action buttons (quieter opacity, fully distinct hover) */}
                  <div className="flex items-center gap-1 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenAnalytics(project.id);
                      }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800/65 border border-transparent hover:border-zinc-800 transition-all"
                      title={lang === 'en' ? 'Analytics' : 'Аналитика'}
                    >
                      <Settings className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setProjectToDelete(project.id);
                      }}
                      id={`btn-delete-project-${project.id}`}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-950/20 transition-all"
                      title={lang === 'en' ? 'Delete Project' : 'Удалить проект'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Status Badges & Navigation Action */}
              <div className="flex items-end justify-between border-t border-zinc-900/50 pt-4">
                <div className="flex flex-wrap gap-2">
                  {/* Type Badge */}
                  <span className={`text-[9px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md border ${
                    project.type === 'personal_card'
                      ? 'bg-blue-500/5 text-blue-400 border-blue-500/10'
                      : project.type === 'menu'
                      ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/10'
                      : 'bg-purple-500/5 text-purple-400 border-purple-500/10'
                  }`}>
                    {project.type === 'personal_card' && (lang === 'en' ? 'Personal' : 'Визитка')}
                    {project.type === 'menu' && (lang === 'en' ? 'Menu' : 'Меню')}
                    {project.type === 'catalog' && (lang === 'en' ? 'Catalog' : 'Каталог')}
                  </span>

                  {/* Plan Badge */}
                  {project.plan === 'premium' ? (
                    <span className="relative overflow-hidden text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/15 flex items-center gap-1 select-none">
                      <Sparkles className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                      {lang === 'en' ? 'Premium' : 'Премиум'}
                      <span className="absolute inset-0 w-full h-full pointer-events-none">
                        <span className="absolute inset-y-0 w-4 bg-white/10 blur-[2px] -left-8 animate-shine-ten" />
                      </span>
                    </span>
                  ) : (
                    <span className="text-[9px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md border bg-zinc-900/40 text-zinc-500 border-zinc-850">
                      {lang === 'en' ? 'Standard' : 'Стандарт'}
                    </span>
                  )}
                </div>

                {/* Micro hover interaction indicating edit action */}
                <div className="text-zinc-500 group-hover:text-zinc-200 transition-colors duration-300 flex items-center gap-1 text-xs font-semibold select-none">
                  <span>{lang === 'en' ? 'Edit' : 'Настроить'}</span>
                  <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Step 3: Stylish Project Creation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative w-full max-w-lg bg-zinc-950 border border-zinc-850 rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col"
            >
              {/* Header */}
              <div className="p-5 border-b border-zinc-850 flex items-center justify-between bg-zinc-900/50">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                    <Folder className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-white text-lg">
                    {lang === 'en' ? 'Create New Project' : 'Создание нового проекта'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-zinc-400 hover:text-white hover:bg-zinc-800/50 p-1.5 rounded-lg transition-colors border border-transparent hover:border-zinc-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleCreate} className="flex-1 flex flex-col overflow-hidden">
                <div className="p-6 space-y-5 overflow-y-auto max-h-[60vh] custom-scrollbar">
                  
                  {/* 1. Name & Description */}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="project-name-input" className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                        {lang === 'en' ? 'Project Name *' : 'Название проекта *'}
                      </label>
                      <input
                        type="text"
                        id="project-name-input"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (e.target.value.trim() && error) setError('');
                        }}
                        placeholder={lang === 'en' ? 'e.g., My Portfolio, Summer Menu' : 'например, Моё портфолио, Летнее меню'}
                        className={`w-full bg-zinc-900 border ${error ? 'border-rose-500/50 focus:border-rose-500' : 'border-zinc-800 focus:border-indigo-500'} text-sm text-white rounded-xl px-4 py-3 focus:outline-none transition-colors placeholder-zinc-600`}
                        autoFocus
                      />
                      {error && (
                        <p className="text-[11px] text-rose-400 flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {error}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="project-desc-input" className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                        {lang === 'en' ? 'Description' : 'Описание проекта'}
                      </label>
                      <textarea
                        id="project-desc-input"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={lang === 'en' ? 'Briefly describe your brand or objective' : 'Кратко опишите бренд или назначение страницы'}
                        rows={2}
                        className="w-full bg-zinc-900 border border-zinc-800 focus:border-indigo-500 text-sm text-white rounded-xl px-4 py-2.5 focus:outline-none transition-colors placeholder-zinc-600 resize-none"
                      />
                    </div>
                  </div>

                  {/* 2. Avatar Upload with Preview and Compression */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                      {lang === 'en' ? 'Avatar / Brand Logo' : 'Аватар / Логотип бренда'}
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden shrink-0">
                        {avatar ? (
                          <img src={avatar} className="w-full h-full object-cover" alt="Avatar preview" />
                        ) : (
                          <User className="w-6 h-6 text-zinc-650" />
                        )}
                        {isCompressing && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 space-y-1">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-350 hover:text-white cursor-pointer transition-colors">
                          <Plus className="w-3.5 h-3.5" />
                          <span>{lang === 'en' ? 'Upload Image' : 'Загрузить картинку'}</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setIsCompressing(true);
                              try {
                                const compressed = await compressAvatar(file);
                                setAvatar(compressed);
                              } catch (err) {
                                console.error('Failed to compress avatar:', err);
                              } finally {
                                setIsCompressing(false);
                              }
                            }}
                          />
                        </label>
                        <p className="text-[10px] text-zinc-500 leading-normal">
                          {lang === 'en' 
                            ? 'JPG, PNG, WebP. High-res images are automatically compressed to 512px on the fly.' 
                            : 'JPG, PNG, WebP. Большие картинки автоматически сжимаются до 512px на лету.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 3. Type Field: 3 Tile Cards */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                      {lang === 'en' ? 'Project Type' : 'Тип проекта'}
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      
                      {/* Option 1: Personal Card */}
                      <button
                        type="button"
                        onClick={() => setType('personal_card')}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                          type === 'personal_card'
                            ? 'bg-indigo-600/10 border-indigo-500 ring-2 ring-indigo-500/40 text-white'
                            : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                        }`}
                      >
                        <User className={`w-5 h-5 mb-1.5 ${type === 'personal_card' ? 'text-indigo-400' : 'text-zinc-500'}`} />
                        <span className="text-[10px] font-bold block">
                          {lang === 'en' ? 'Card' : 'Визитка'}
                        </span>
                      </button>

                      {/* Option 2: Menu */}
                      <button
                        type="button"
                        onClick={() => setType('menu')}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                          type === 'menu'
                            ? 'bg-indigo-600/10 border-indigo-500 ring-2 ring-indigo-500/40 text-white'
                            : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                        }`}
                      >
                        <UtensilsCrossed className={`w-5 h-5 mb-1.5 ${type === 'menu' ? 'text-indigo-400' : 'text-zinc-500'}`} />
                        <span className="text-[10px] font-bold block">
                          {lang === 'en' ? 'Menu' : 'Меню'}
                        </span>
                      </button>

                      {/* Option 3: Catalog */}
                      <button
                        type="button"
                        onClick={() => setType('catalog')}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                          type === 'catalog'
                            ? 'bg-indigo-600/10 border-indigo-500 ring-2 ring-indigo-500/40 text-white'
                            : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                        }`}
                      >
                        <Layers className={`w-5 h-5 mb-1.5 ${type === 'catalog' ? 'text-indigo-400' : 'text-zinc-500'}`} />
                        <span className="text-[10px] font-bold block">
                          {lang === 'en' ? 'Catalog' : 'Каталог'}
                        </span>
                      </button>

                    </div>
                  </div>

                  {/* 4. Layout Selection */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                      {lang === 'en' ? 'Layout Structure' : 'Выбор макета (Layout)'}
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {/* Classic */}
                      <button
                        type="button"
                        onClick={() => setLayout('classic')}
                        className={`p-2 rounded-xl border flex flex-col gap-1.5 transition-all cursor-pointer text-left relative overflow-hidden h-[95px] ${
                          layout === 'classic'
                            ? 'bg-indigo-600/10 border-indigo-500 ring-2 ring-indigo-500/40 text-white'
                            : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                        }`}
                      >
                        <div className="flex-1 w-full bg-zinc-950/65 rounded-lg p-1 flex flex-col items-center justify-center gap-0.5 border border-zinc-850/30">
                          <div className="w-4 h-4 rounded-full bg-zinc-800 border border-zinc-700 shrink-0" />
                          <div className="w-8 h-1 bg-zinc-700 rounded-full" />
                          <div className="w-5 h-1 bg-zinc-800 rounded-full" />
                        </div>
                        <span className="text-[10px] font-bold block text-center">
                          {lang === 'en' ? 'Classic (Centered)' : 'Классический'}
                        </span>
                      </button>

                      {/* Compact */}
                      <button
                        type="button"
                        onClick={() => setLayout('compact')}
                        className={`p-2 rounded-xl border flex flex-col gap-1.5 transition-all cursor-pointer text-left relative overflow-hidden h-[95px] ${
                          layout === 'compact'
                            ? 'bg-indigo-600/10 border-indigo-500 ring-2 ring-indigo-500/40 text-white'
                            : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                        }`}
                      >
                        <div className="flex-1 w-full bg-zinc-950/65 rounded-lg p-1.5 flex items-center gap-1.5 border border-zinc-850/30">
                          <div className="w-4 h-4 rounded-full bg-zinc-800 border border-zinc-700 shrink-0" />
                          <div className="flex-1 space-y-0.5">
                            <div className="w-6 h-1 bg-zinc-700 rounded-full" />
                            <div className="w-9 h-1 bg-zinc-800 rounded-full" />
                          </div>
                        </div>
                        <span className="text-[10px] font-bold block text-center">
                          {lang === 'en' ? 'Compact (Left)' : 'Компактный'}
                        </span>
                      </button>

                      {/* Cover */}
                      <button
                        type="button"
                        onClick={() => setLayout('cover')}
                        className={`p-2 rounded-xl border flex flex-col gap-1.5 transition-all cursor-pointer text-left relative overflow-hidden h-[95px] ${
                          layout === 'cover'
                            ? 'bg-indigo-600/10 border-indigo-500 ring-2 ring-indigo-500/40 text-white'
                            : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                        }`}
                      >
                        <div className="flex-1 w-full bg-zinc-950/65 rounded-lg overflow-hidden border border-zinc-850/30 flex flex-col items-center">
                          <div className="w-full h-4 bg-gradient-to-r from-indigo-900 to-pink-900 shrink-0" />
                          <div className="w-3 h-3 rounded-full bg-zinc-800 border border-zinc-700 shrink-0 -mt-1.5 z-10" />
                          <div className="w-5 h-1 bg-zinc-700 rounded-full mt-1" />
                        </div>
                        <span className="text-[10px] font-bold block text-center">
                          {lang === 'en' ? 'Cover (Hero)' : 'Баннер (Hero)'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* 5. Preset Style Selection */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                      {lang === 'en' ? 'Style Theme' : 'Стиль оформления (Preset)'}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 'cosmic', nameEn: 'Cosmic', nameRu: 'Космический', gradient: 'from-indigo-900 via-purple-900 to-pink-950' },
                        { id: 'sunset', nameEn: 'Sunset', nameRu: 'Закат', gradient: 'from-amber-600 via-rose-600 to-indigo-900' },
                        { id: 'ocean', nameEn: 'Ocean', nameRu: 'Океан', gradient: 'from-blue-900 via-teal-900 to-zinc-950' },
                        { id: 'emerald', nameEn: 'Emerald', nameRu: 'Изумруд', gradient: 'from-emerald-900 via-teal-900 to-zinc-950' },
                        { id: 'fire', nameEn: 'Solar Flare', nameRu: 'Вспышка', gradient: 'from-orange-600 via-red-600 to-yellow-500' },
                      ].map((preset) => {
                        const isSelected = themeStyle === preset.id;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => setThemeStyle(preset.id)}
                            className={`group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer relative ${
                              isSelected
                                ? 'border-indigo-500 bg-indigo-500/10 text-white'
                                : 'border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200'
                            }`}
                          >
                            <div className={`w-3 h-3 rounded-full bg-gradient-to-tr ${preset.gradient} border border-white/20 shrink-0 group-hover:scale-110 transition-transform`} />
                            <span className="text-[10px] font-semibold leading-none">
                              {lang === 'en' ? preset.nameEn : preset.nameRu}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 6. Plan Toggle with Details */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                      {lang === 'en' ? 'Plan' : 'Тариф'}
                    </label>
                    <div className="grid grid-cols-2 gap-2 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
                      
                      {/* Basic Plan tab */}
                      <button
                        type="button"
                        onClick={() => setPlan('basic')}
                        className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          plan === 'basic'
                            ? 'bg-zinc-800 text-white shadow'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        {lang === 'en' ? 'Standard (Basic)' : 'Стандартный (Basic)'}
                      </button>

                      {/* Premium Plan tab */}
                      <button
                        type="button"
                        onClick={() => setPlan('premium')}
                        className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          plan === 'premium'
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow'
                            : 'text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        {lang === 'en' ? 'Premium' : 'Премиум (Premium)'}
                      </button>

                    </div>

                    {/* Plan description panel */}
                    <div className="p-3.5 rounded-xl border bg-zinc-900/30 border-zinc-850 text-xs text-zinc-400 leading-relaxed">
                      {plan === 'premium' ? (
                        <p className="flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <span>
                            {lang === 'en'
                              ? '👑 Premium plan unlocks amazing advanced background shaders (3D Waves, WebGL Metaballs, Topography), avatar effects, block glow sweeps, custom high-contrast filters, and premium templates.'
                              : '👑 Премиум-тариф открывает доступ к передовым 3D-шейдерам фона (3D Волны, WebGL Метасферы, Топография), эффектам свечения аватарок, бликам плашек и эксклюзивным темам.'}
                          </span>
                        </p>
                      ) : (
                        <p className="flex items-start gap-2 text-zinc-500">
                          <AlertCircle className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                          <span>
                            {lang === 'en'
                              ? 'Standard plan includes organic blobs, stars, core styling elements, and local saving capabilities. Advanced background shaders and interactive effects are locked.'
                              : 'Стандартный тариф включает органические капли, звезды, базовое оформление и локальное сохранение. Сложные шейдеры и спецэффекты заблокированы.'}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>

                </div>

                {/* Action Buttons */}
                <div className="p-5 border-t border-zinc-850 flex items-center justify-end gap-3 bg-zinc-900/40 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-lg text-xs font-bold border border-zinc-800 transition-colors cursor-pointer"
                  >
                    {lang === 'en' ? 'Cancel' : 'Отмена'}
                  </button>
                  <button
                    type="submit"
                    id="btn-create-project-submit"
                    disabled={!name.trim() || isCompressing}
                    className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-lg shadow-indigo-600/15 cursor-pointer ${
                      name.trim() && !isCompressing
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500'
                        : 'bg-zinc-800 text-zinc-500 border border-zinc-750 cursor-not-allowed'
                    }`}
                  >
                    {lang === 'en' ? 'Create Project' : 'Создать проект'}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </form>
            </motion.div>

          </div>
        )}
      </AnimatePresence>
      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {projectToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setProjectToDelete(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative bg-zinc-950 border border-zinc-850 rounded-2xl p-6 shadow-2xl max-w-sm w-full text-center"
            >
              <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 tracking-tight">
                {lang === 'en' ? 'Delete Project?' : 'Удалить проект?'}
              </h3>
              <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
                {lang === 'en' 
                  ? 'Are you sure you want to delete this project? This action cannot be undone.' 
                  : 'Вы уверены, что хотите удалить этот проект? Это действие нельзя отменить.'}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setProjectToDelete(null)}
                  className="flex-1 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white rounded-xl text-xs uppercase tracking-wider font-bold transition-colors"
                >
                  {lang === 'en' ? 'Cancel' : 'Отмена'}
                </button>
                <button
                  onClick={() => {
                    deleteProject(projectToDelete);
                    toastSuccess(lang === 'en' ? 'Project deleted' : 'Проект удален');
                    setProjectToDelete(null);
                  }}
                  className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs uppercase tracking-wider font-bold shadow-lg shadow-rose-600/20 transition-all active:scale-[0.98]"
                >
                  {lang === 'en' ? 'Delete' : 'Удалить'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
