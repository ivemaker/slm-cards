import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useDev, MockProject } from '../context/DevContext';
import { 
  Plus, 
  Trash2, 
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

export const ProjectsTab: React.FC<ProjectsTabProps> = ({ lang }) => {
  const { 
    projects, 
    activeProjectId, 
    setActiveProjectId, 
    createProject, 
    deleteProject, 
    setActiveTab 
  } = useDev();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<MockProject['type']>('personal_card');
  const [plan, setPlan] = useState<MockProject['plan']>('basic');
  const [error, setError] = useState('');

  const openModal = () => {
    setName('');
    setType('personal_card');
    setPlan('basic');
    setError('');
    setIsModalOpen(true);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(lang === 'en' ? 'Project name is required' : 'Имя проекта обязательно');
      return;
    }
    createProject(name.trim(), type, plan);
    setIsModalOpen(false);
    setActiveTab('editor');
  };

  const handleEditProject = (projId: string) => {
    setActiveProjectId(projId);
    setActiveTab('editor');
  };

  return (
    <div className="flex-1 w-full px-4 sm:px-6 md:px-8 py-8 animate-fade-in relative z-10 text-white min-h-screen">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <Folder className="w-8 h-8 text-indigo-400" />
          {lang === 'en' ? 'My Projects' : 'Мои Проекты'}
        </h2>
        <p className="text-sm text-zinc-400 mt-1.5 max-w-2xl leading-relaxed">
          {lang === 'en' 
            ? 'Manage and create your customizable sites, links, and catalogs in Creator Studio.' 
            : 'Управляйте и создавайте свои интерактивные визитки, меню и каталоги.'}
        </p>
      </div>

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Step 2: Create new project card button */}
        <button
          onClick={openModal}
          id="btn-create-project-trigger"
          className="group h-[240px] border-2 border-dashed border-zinc-800 hover:border-indigo-500 rounded-xl flex flex-col items-center justify-center transition-all duration-300 bg-zinc-950/20 hover:bg-indigo-950/10 cursor-pointer"
        >
          <div className="w-12 h-12 bg-zinc-900 group-hover:bg-indigo-500/20 border border-zinc-800 group-hover:border-indigo-500/30 rounded-full flex items-center justify-center text-zinc-400 group-hover:text-indigo-400 transition-all duration-300 shadow-lg">
            <Plus className="w-6 h-6" />
          </div>
          <span className="mt-4 text-sm font-semibold text-zinc-400 group-hover:text-indigo-300 transition-colors duration-300">
            {lang === 'en' ? 'Create New Project' : 'Создать новый проект'}
          </span>
          <span className="mt-1 text-xs text-zinc-600 group-hover:text-indigo-400/60 max-w-[200px] text-center px-4">
            {lang === 'en' ? 'Start from a beautiful template wireframe' : 'Начните с готового профессионального шаблона'}
          </span>
        </button>

        {/* Existing Projects */}
        {projects.map((project) => {
          const isActive = activeProjectId === project.id;
          return (
            <div 
              key={project.id}
              id={`project-card-${project.id}`}
              className={`h-[240px] bg-zinc-900 border ${isActive ? 'border-indigo-500/80 shadow-indigo-500/5 shadow-2xl' : 'border-zinc-850'} rounded-xl p-5 hover:border-zinc-700 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden`}
            >
              {/* Subtle ambient gradient overlay for active card */}
              {isActive && (
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
              )}

              {/* Top part of project card */}
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-md border ${
                      project.type === 'personal_card' 
                        ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' 
                        : project.type === 'menu' 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : 'bg-purple-500/10 border-purple-500/20 text-purple-400'
                    }`}>
                      {project.type === 'personal_card' && <User className="w-5 h-5" />}
                      {project.type === 'menu' && <UtensilsCrossed className="w-5 h-5" />}
                      {project.type === 'catalog' && <Layers className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-zinc-100 group-hover:text-white transition-colors line-clamp-1 text-base">
                        {project.name}
                      </h3>
                      <p className="text-[10px] text-zinc-500 mt-0.5">
                        {lang === 'en' ? 'Created:' : 'Создан:'} {project.createdAt}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteProject(project.id)}
                    id={`btn-delete-project-${project.id}`}
                    className="text-zinc-500 hover:text-rose-400 transition-colors p-1.5 rounded-lg bg-zinc-950/40 border border-zinc-850 hover:border-rose-950/50"
                    title={lang === 'en' ? 'Delete Project' : 'Удалить проект'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Badges Section */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {/* Type Badge */}
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                    project.type === 'personal_card'
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      : project.type === 'menu'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                  }`}>
                    {project.type === 'personal_card' && (lang === 'en' ? 'Personal Card' : 'Личная визитка')}
                    {project.type === 'menu' && (lang === 'en' ? 'Menu' : 'Меню')}
                    {project.type === 'catalog' && (lang === 'en' ? 'Catalog' : 'Каталог')}
                  </span>

                  {/* Plan Badge */}
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                    project.plan === 'premium'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/25'
                      : 'bg-zinc-800 text-zinc-400 border-zinc-750'
                  }`}>
                    {project.plan === 'premium' && <Sparkles className="w-3 h-3 text-amber-400" />}
                    {project.plan === 'premium' 
                      ? (lang === 'en' ? 'Premium 👑' : 'Премиум 👑') 
                      : (lang === 'en' ? 'Standard' : 'Стандарт')}
                  </span>

                  {/* Active Indicator Badge */}
                  {isActive && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md border bg-indigo-500/10 text-indigo-400 border-indigo-500/20 animate-pulse">
                      {lang === 'en' ? 'Active Editor' : 'Активен в редакторе'}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-zinc-850 flex items-center justify-between">
                <span className="text-[11px] text-zinc-500">
                  {isActive 
                    ? (lang === 'en' ? 'Currently editing' : 'Редактируется сейчас') 
                    : (lang === 'en' ? 'Inactive project' : 'Неактивный проект')}
                </span>
                <button
                  onClick={() => handleEditProject(project.id)}
                  id={`btn-edit-project-${project.id}`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/10 border border-indigo-500' 
                      : 'bg-zinc-800 hover:bg-zinc-750 text-zinc-200 border border-zinc-700'
                  }`}
                >
                  {lang === 'en' ? 'Edit' : 'Редактировать'}
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
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
              <form onSubmit={handleCreate} className="p-6 space-y-5">
                
                {/* 1. Name Field */}
                <div className="space-y-1.5">
                  <label htmlFor="project-name-input" className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                    {lang === 'en' ? 'Project Name' : 'Название проекта'}
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

                {/* 2. Type Field: 3 Tile Cards */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                    {lang === 'en' ? 'Project Type' : 'Тип проекта'}
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    
                    {/* Option 1: Personal Card */}
                    <button
                      type="button"
                      onClick={() => setType('personal_card')}
                      className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                        type === 'personal_card'
                          ? 'bg-indigo-600/10 border-indigo-500 ring-2 ring-indigo-500/40 text-white'
                          : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                      }`}
                    >
                      <User className={`w-6 h-6 mb-2 ${type === 'personal_card' ? 'text-indigo-400' : 'text-zinc-400'}`} />
                      <span className="text-[11px] font-bold block">
                        {lang === 'en' ? 'Card' : 'Визитка'}
                      </span>
                    </button>

                    {/* Option 2: Menu */}
                    <button
                      type="button"
                      onClick={() => setType('menu')}
                      className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                        type === 'menu'
                          ? 'bg-indigo-600/10 border-indigo-500 ring-2 ring-indigo-500/40 text-white'
                          : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                      }`}
                    >
                      <UtensilsCrossed className={`w-6 h-6 mb-2 ${type === 'menu' ? 'text-indigo-400' : 'text-zinc-400'}`} />
                      <span className="text-[11px] font-bold block">
                        {lang === 'en' ? 'Menu' : 'Меню'}
                      </span>
                    </button>

                    {/* Option 3: Catalog */}
                    <button
                      type="button"
                      onClick={() => setType('catalog')}
                      className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                        type === 'catalog'
                          ? 'bg-indigo-600/10 border-indigo-500 ring-2 ring-indigo-500/40 text-white'
                          : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                      }`}
                    >
                      <Layers className={`w-6 h-6 mb-2 ${type === 'catalog' ? 'text-indigo-400' : 'text-zinc-400'}`} />
                      <span className="text-[11px] font-bold block">
                        {lang === 'en' ? 'Catalog' : 'Каталог'}
                      </span>
                    </button>

                  </div>
                </div>

                {/* 3. Plan Toggle with Details */}
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

                {/* Action Buttons */}
                <div className="pt-4 border-t border-zinc-850 flex items-center justify-end gap-3 bg-zinc-950/20">
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
                    disabled={!name.trim()}
                    className={`px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-lg shadow-indigo-600/15 cursor-pointer ${
                      name.trim()
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
    </div>
  );
};
