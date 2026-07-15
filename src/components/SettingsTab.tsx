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

  const [whatsappPhone, setWhatsappPhone] = useState(activeProject?.whatsappPhone || '');
  const [telegramUsername, setTelegramUsername] = useState(activeProject?.telegramUsername || '');

  useEffect(() => {
    setWhatsappPhone(activeProject?.whatsappPhone || '');
    setTelegramUsername(activeProject?.telegramUsername || '');
  }, [activeProject?.id, activeProject?.whatsappPhone, activeProject?.telegramUsername]);

  const handleSaveOrders = () => {
    if (activeProjectId) {
      updateProject(activeProjectId, {
        whatsappPhone,
        telegramUsername
      });
      toast.success(lang === 'en' ? 'Orders settings saved!' : 'Настройки приема заказов сохранены!');
    }
  };

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

        {/* Form Group 3 - Ecom Orders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-zinc-100">
          <div className="space-y-4 md:col-span-2 max-w-xl">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShoppingCart className="w-3.5 h-3.5" />
                {lang === 'en' ? 'Orders Receiving' : 'Прием заказов'}
              </h4>
              <button 
                onClick={handleSaveOrders}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold rounded-lg transition-colors shadow-sm"
              >
                {lang === 'en' ? 'Save Settings' : 'Сохранить настройки'}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-zinc-500 mb-1">
                  {lang === 'en' ? 'WhatsApp Number' : 'Номер WhatsApp'}
                </label>
                <input 
                  type="text" 
                  value={whatsappPhone}
                  onChange={(e) => setWhatsappPhone(e.target.value)}
                  placeholder="79001234567"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-600 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-zinc-500 mb-1">
                  {lang === 'en' ? 'Telegram Username' : 'Telegram Username'}
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400 bg-zinc-100 border border-zinc-200 px-2 py-2 rounded-lg font-mono">@</span>
                  <input 
                    type="text" 
                    value={telegramUsername}
                    onChange={(e) => setTelegramUsername(e.target.value)}
                    placeholder="durov"
                    className="flex-1 w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-600 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 font-mono"
                  />
                </div>
              </div>
            </div>
            <p className="text-[10px] text-zinc-400 leading-relaxed">
              {lang === 'en' 
                ? 'Enable e-commerce features on your blocks to start receiving orders directly to your messengers.' 
                : 'Включите функции корзины в настройках блоков (кнопок или товаров), чтобы получать уведомления о заказах напрямую в мессенджеры.'}
            </p>
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
