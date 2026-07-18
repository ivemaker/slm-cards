import React from 'react';
import { useDev } from '../context/DevContext';
import { 
  FolderOpen, 
  Sliders, 
  TrendingUp, 
  Settings as SettingsIcon, 
  Lock, 
  Globe, 
  Eye, 
  Languages, 
  Cloud, 
  Check, 
  Loader2, 
  LogOut, 
  User,
  Shield,
  HelpCircle,
  Sparkles,
  Database,
  SlidersHorizontal,
  Bell
} from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
  lang: 'en' | 'ru';
  setLang: (lang: 'en' | 'ru') => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, lang, setLang }) => {
  const { 
    activeTab, 
    setActiveTab, 
    activeProjectId, 
    projects, 
    isAuthenticated,
    login,
    logout,
    isSaving,
    planType,
    setPlanType
  } = useDev();

  const activeProject = projects.find(p => p.id === activeProjectId);

  const menuItems = [
    {
      id: 'landing' as const,
      labelEn: 'Welcome',
      labelRu: 'Приветствие',
      icon: Globe,
      disabled: false,
    },
    {
      id: 'projects' as const,
      labelEn: 'My Projects',
      labelRu: 'Мои проекты',
      icon: FolderOpen,
      disabled: false,
    },
    {
      id: 'editor' as const,
      labelEn: 'Editor',
      labelRu: 'Редактор',
      icon: Sliders,
      disabled: false, // Don't disable completely, clicking will show the friendly placeholder
      requiresProject: true,
    },
    {
      id: 'settings' as const,
      labelEn: 'Settings',
      labelRu: 'Настройки',
      icon: SettingsIcon,
      disabled: false,
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col md:flex-row text-zinc-900 font-sans">
      
      {/* SIDEBAR FOR DESKTOP */}
      <aside className="hidden md:flex flex-col w-64 bg-zinc-950 text-white border-r border-zinc-800 shrink-0 z-30">
        {/* BRAND HEADER */}
        <div className="p-6 border-b border-zinc-900 flex items-center justify-start">
          <img
            src="/SLM cards logo.svg"
            alt="SLM Cards"
            className="h-8 w-auto object-contain"
            style={{ filter: 'brightness(0) invert(1)' }}
            referrerPolicy="no-referrer"
          />
        </div>

        {/* ACTIVE PROJECT BADGE */}
        <div className="px-4 py-3 mx-3 my-4 bg-zinc-900/60 border border-zinc-900 rounded-xl">
          <div className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider mb-1">
            {lang === 'en' ? 'Active Project' : 'Активный проект'}
          </div>
          {activeProject ? (
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-zinc-200 truncate" title={activeProject.name}>
                {activeProject.name}
              </span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                activeProject.plan === 'premium' 
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                  : activeProject.plan === 'unpaid'
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  : 'bg-zinc-850 text-zinc-400 border border-zinc-800'
              }`}>
                {activeProject.plan === 'premium' ? 'Premium' : activeProject.plan === 'unpaid' ? 'Unpaid' : 'Standard'}
              </span>
            </div>
          ) : (
            <div className="text-xs text-zinc-500 italic">
              {lang === 'en' ? 'No project selected' : 'Проект не выбран'}
            </div>
          )}
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 px-3 space-y-1">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isLocked = item.requiresProject && !activeProjectId;
            const label = lang === 'en' ? item.labelEn : item.labelRu;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-zinc-900 text-white font-bold shadow-inner' 
                    : 'text-zinc-400 hover:bg-zinc-900/40 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-indigo-400 scale-105' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                  <span>{label}</span>
                </div>
                {isLocked && (
                  <span className="text-[10px] bg-zinc-900 text-zinc-500 px-1.5 py-0.5 rounded border border-zinc-800 flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" />
                    <span className="hidden lg:inline text-[8px] uppercase font-bold">Lock</span>
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* UTILITY FOOTER */}
        <div className="p-4 border-t border-zinc-900 space-y-3">
          {/* LAN SWITCH & LOGOUT */}
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => setLang(lang === 'en' ? 'ru' : 'en')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white transition-colors text-xs font-semibold cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'RU' : 'EN'}</span>
            </button>

            {isAuthenticated ? (
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-red-950/20 text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors text-xs font-semibold cursor-pointer"
                title={lang === 'en' ? 'Logout' : 'Выйти'}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">{lang === 'en' ? 'Logout' : 'Выход'}</span>
              </button>
            ) : (
              <button
                onClick={login}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-950/20 text-emerald-400 hover:bg-emerald-950/40 hover:text-emerald-300 transition-colors text-xs font-semibold cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Login' : 'Войти'}</span>
              </button>
            )}
          </div>

          {/* USER PROFILE INFO */}
          {isAuthenticated && (
            <div className="flex items-center gap-2.5 pt-2 border-t border-zinc-900/40">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-[11px] font-bold text-white uppercase shrink-0">
                US
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-semibold text-zinc-300 truncate">ivemaker@gmail.com</div>
                <div className="text-[9px] text-zinc-500 font-mono">
                  Role: {lang === 'en' ? 'Authorized' : 'Авторизован'}
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* MOBILE HEADER & BOTTOM NAV */}
      <div className="flex md:hidden flex-col w-full bg-zinc-950 text-white z-30">
        <div className="px-4 py-3 border-b border-zinc-900 flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="/SLM cards logo.svg"
              alt="SLM Cards"
              className="h-7 w-auto object-contain"
              style={{ filter: 'brightness(0) invert(1)' }}
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLang(lang === 'en' ? 'ru' : 'en')}
              className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 hover:text-white px-2 py-1 bg-zinc-900 rounded"
            >
              {lang === 'en' ? 'RU' : 'EN'}
            </button>
            {isAuthenticated && (
              <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold">
                US
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        
        {/* SHARED APP HEADER (Containing Save status / Editor specific buttons) */}
        <header className="bg-white border-b border-zinc-200 py-3.5 px-4 sm:px-6 md:px-8 flex items-center justify-between gap-4 z-10 shadow-sm shrink-0">
          <div className="flex items-center gap-2.5">
            <h2 className="text-sm font-bold tracking-tight text-zinc-900 uppercase">
              {activeTab === 'landing' && (lang === 'en' ? 'Welcome Platform' : 'Платформа приветствия')}
              {activeTab === 'projects' && (lang === 'en' ? 'Project Console' : 'Консоль проектов')}
              {activeTab === 'editor' && (lang === 'en' ? 'Live No-Code Builder' : 'Конструктор микролендингов')}
              {activeTab === 'dashboard' && (lang === 'en' ? 'Performance Insights' : 'Аналитика и статистика')}
              {activeTab === 'settings' && (lang === 'en' ? 'Platform Configuration' : 'Конфигурация платформы')}
              {activeTab === 'preview' && (lang === 'en' ? 'Public View Sandbox' : 'Песочница публичного вида')}
            </h2>

            {/* SAVE INDICATOR FOR EDITOR */}
            {activeTab === 'editor' && (
              <div className="flex items-center gap-1.5 ml-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping absolute" />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 relative" />
                <div className="flex items-center gap-1 text-[11px] text-zinc-500 font-mono select-none">
                  {isSaving ? (
                    <span className="flex items-center gap-1 text-amber-600 font-semibold animate-pulse">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      {lang === 'en' ? 'Autosaving...' : 'Автосохранение...'}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                      <Check className="w-3 h-3" />
                      {lang === 'en' ? 'Saved' : 'Сохранено'}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* QUICK CONTROLS OR INDICATORS */}
          <div className="flex items-center gap-2">
            {activeTab === 'editor' && activeProjectId && (
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mr-1">
                  {lang === 'en' ? 'Active Plan:' : 'Текущий тариф:'}
                </span>
                <button
                  onClick={() => setPlanType(planType === 'premium' ? 'basic' : 'premium')}
                  className={`px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-md border transition-all ${
                    planType === 'premium'
                      ? 'bg-amber-500/10 text-amber-700 border-amber-300/60 shadow-sm hover:bg-amber-500/20'
                      : 'bg-zinc-100 text-zinc-600 border-zinc-200 hover:bg-zinc-200'
                  }`}
                >
                  {planType === 'premium' ? '✨ Premium' : '📁 Basic'}
                </button>
              </div>
            )}
          </div>
        </header>

        {/* WORKSPACE CONTENT AREA */}
        <div className="flex-1 flex flex-col min-h-0 bg-zinc-50 overflow-y-auto">
          {activeTab === 'settings' ? (
            /* SETTINGS PLACEHOLDER PAGE */
            <div className="flex-1 w-full p-4 sm:p-6 md:p-8 max-w-4xl mx-auto space-y-6">
              <div className="border border-zinc-200 rounded-2xl bg-white p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-3.5 mb-6 border-b border-zinc-100 pb-5">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <SettingsIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-950">
                      {lang === 'en' ? 'Platform Settings' : 'Настройки платформы'}
                    </h3>
                    <p className="text-xs text-zinc-500">
                      {lang === 'en' ? 'Configure integrations, API keys, and account preferences' : 'Настройте интеграции, API ключи и параметры учетной записи'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Mock Form Group 1 */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      {lang === 'en' ? 'Account Profile' : 'Профиль аккаунта'}
                    </h4>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-500 mb-1">
                          {lang === 'en' ? 'Email Address' : 'Адрес электронной почты'}
                        </label>
                        <input 
                          type="text" 
                          readOnly 
                          value="ivemaker@gmail.com" 
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-500 mb-1">
                          {lang === 'en' ? 'Profile Role' : 'Роль профиля'}
                        </label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="text" 
                            readOnly 
                            value={isAuthenticated ? 'Authorized (Creator)' : 'Guest (Visitor)'} 
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-600 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mock Form Group 2 */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" />
                      {lang === 'en' ? 'Developer & Integrations' : 'Разработчик и интеграции'}
                    </h4>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-500 mb-1">
                          {lang === 'en' ? 'GitHub Repository' : 'Репозиторий GitHub'}
                        </label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="text" 
                            readOnly 
                            value="ivemaker/slm-cards" 
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-600 focus:outline-none font-mono"
                          />
                          <span className="text-[10px] px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md font-bold shrink-0">
                            Connected
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-zinc-500 mb-1">
                          {lang === 'en' ? 'Local Persistence Engine' : 'Движок локального хранения'}
                        </label>
                        <div className="text-xs text-zinc-600 bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 flex items-center justify-between">
                          <span className="font-mono text-[10px]">localStorage.get('slm_projects')</span>
                          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Active
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <HelpCircle className="w-4 h-4 text-zinc-400" />
                    <span>{lang === 'en' ? 'Settings are mock simulations for this step.' : 'Параметры настроек имитируются на данном шаге.'}</span>
                  </div>
                  <button 
                    disabled 
                    className="px-4 py-2 bg-zinc-100 border border-zinc-200 text-zinc-400 text-xs font-bold rounded-lg cursor-not-allowed"
                  >
                    {lang === 'en' ? 'Save Changes' : 'Сохранить изменения'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            children
          )}
        </div>

        {/* MOBILE BOTTOM NAVIGATION MENU */}
        <nav className="md:hidden sticky bottom-0 left-0 right-0 bg-zinc-950 border-t border-zinc-900 text-zinc-400 py-1.5 px-3 flex justify-around items-center z-30 shadow-[0_-5px_15px_rgba(0,0,0,0.3)]">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const label = lang === 'en' ? item.labelEn : item.labelRu;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 px-2.5 py-1 text-[10px] font-bold relative transition-colors ${
                  isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : ''}`} />
                <span className="text-[9px] truncate max-w-[64px]">{label}</span>
                {isActive && (
                  <span className="absolute -top-1.5 w-1 h-1 rounded-full bg-indigo-500" />
                )}
              </button>
            );
          })}
        </nav>

      </div>

    </div>
  );
};
