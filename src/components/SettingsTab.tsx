import React, { useState, useEffect } from 'react';
import { useDev } from '../context/DevContext';
import { 
  Settings as SettingsIcon, 
  User, 
  Shield, 
  HelpCircle,
  Check,
  Loader2,
  ShoppingCart
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface SettingsTabProps {
  lang: 'en' | 'ru';
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ lang }) => {
  const { isAuthenticated, activeProjectId, projects, updateProject } = useDev();
  const toast = useToast();

  const activeProject = projects.find(p => p.id === activeProjectId);



  return (
    <div className="flex-1 w-full p-4 sm:p-6 md:p-8 max-w-4xl mx-auto space-y-6 animate-fade-in">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Form Group 1 */}
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

          {/* Form Group 2 */}
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
  );
};
