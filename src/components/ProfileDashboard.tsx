import React, { useState } from 'react';
import { useDev } from '../context/DevContext';
import { useToast } from '../context/ToastContext';

interface ProfileDashboardProps {
  lang: 'en' | 'ru';
}

export const ProfileDashboard: React.FC<ProfileDashboardProps> = ({ lang }) => {
  const {
    projects,
    userEmail,
    userBalance,
    isBalanceHidden,
    toggleBalanceVisibility,
    topUpBalance,
    updateCredentials,
    setActiveTab
  } = useDev();

  const toast = useToast();

  const [emailInput, setEmailInput] = useState(userEmail);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState<string>('500');

  // Stable pseudo-random generator matching DashboardTab
  const getStableNumber = (id: string, multiplier: number, min: number = 0) => {
    const seed = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return min + (seed * multiplier) % 1000;
  };

  // Aggregated analytics calculation across all projects
  const totalSites = projects.length;
  let totalViews = 0;
  let totalClicks = 0;

  projects.forEach((proj) => {
    const views = getStableNumber(proj.id, 7, 450);
    const ctrVal = 5.2 + (getStableNumber(proj.id, 17, 0) % 110) / 10;
    const clicks = Math.max(12, Math.round(views * (ctrVal / 100)));

    totalViews += views;
    totalClicks += clicks;
  });

  const avgConversion = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0';

  const handleUpdateEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      toast.error(lang === 'en' ? 'Please enter a valid email' : 'Введите корректный email');
      return;
    }
    updateCredentials(emailInput);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) {
      toast.error(lang === 'en' ? 'Fill in password fields' : 'Заполните поля пароля');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(lang === 'en' ? 'Passwords do not match' : 'Пароли не совпадают');
      return;
    }
    toast.success(lang === 'en' ? 'Password updated successfully' : 'Пароль успешно изменен');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleConfirmTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(topUpAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error(lang === 'en' ? 'Enter a valid amount' : 'Введите корректную сумму');
      return;
    }
    topUpBalance(amount);
    setIsTopUpOpen(false);
  };

  return (
    <div className="flex-1 w-full p-4 sm:p-6 md:p-8 max-w-6xl mx-auto space-y-8 animate-fade-in text-white">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>{lang === 'en' ? 'Account Dashboard' : 'Дашборд аккаунта'}</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            {lang === 'en'
              ? 'Manage your personal balance, security parameters, and aggregate project analytics.'
              : 'Управление личным балансом, настройками безопасности и сквозной аналитикой по всем вашим проектам.'}
          </p>
        </div>

        <button
          onClick={() => setActiveTab('projects')}
          className="self-start sm:self-center px-4 py-2 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-xs font-semibold rounded-xl border border-white/10 transition-all cursor-pointer flex items-center gap-2"
        >
          <svg className="w-4 h-4 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
          <span>{lang === 'en' ? 'Back to Projects' : 'К списку проектов'}</span>
        </button>
      </div>

      {/* BLOCK 1: Aggregate Analytics Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <svg className="w-4 h-4 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 3v18h18" />
              <path d="M18 9l-5 5-4-4-3 3" />
            </svg>
            <span>{lang === 'en' ? 'Aggregate Analytics' : 'Сквозная аналитика'}</span>
          </h2>
          <span className="text-[10px] text-zinc-500 font-mono">
            {lang === 'en' ? 'Across all sites' : 'По всем созданным сайтам'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Sites */}
          <div className="bg-neutral-900/80 border border-white/5 rounded-2xl p-5 shadow-xl hover:border-white/10 transition-all">
            <div className="flex items-center justify-between text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
              <span>{lang === 'en' ? 'Total Sites' : 'Всего сайтов'}</span>
              <svg className="w-4 h-4 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18" />
                <path d="M9 21V9" />
              </svg>
            </div>
            <div className="mt-3 text-3xl font-extrabold text-white tracking-tight">
              {totalSites}
            </div>
            <div className="mt-2 text-[10px] text-zinc-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>{lang === 'en' ? 'Active projects' : 'Активных проектов'}</span>
            </div>
          </div>

          {/* Card 2: Total Views */}
          <div className="bg-neutral-900/80 border border-white/5 rounded-2xl p-5 shadow-xl hover:border-white/10 transition-all">
            <div className="flex items-center justify-between text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
              <span>{lang === 'en' ? 'Total Views' : 'Всего просмотров'}</span>
              <svg className="w-4 h-4 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <div className="mt-3 text-3xl font-extrabold text-white tracking-tight">
              {totalViews.toLocaleString('ru-RU')}
            </div>
            <div className="mt-2 text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <span>↑ 18.2%</span>
              <span className="text-zinc-500">{lang === 'en' ? 'this month' : 'за этот месяц'}</span>
            </div>
          </div>

          {/* Card 3: Total Clicks */}
          <div className="bg-neutral-900/80 border border-white/5 rounded-2xl p-5 shadow-xl hover:border-white/10 transition-all">
            <div className="flex items-center justify-between text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
              <span>{lang === 'en' ? 'Total Clicks' : 'Всего кликов'}</span>
              <svg className="w-4 h-4 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M15 15l5 5" />
                <path d="M10 3a7 7 0 1 0 7 7 7 7 0 0 0-7-7z" />
              </svg>
            </div>
            <div className="mt-3 text-3xl font-extrabold text-white tracking-tight">
              {totalClicks.toLocaleString('ru-RU')}
            </div>
            <div className="mt-2 text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <span>↑ 12.4%</span>
              <span className="text-zinc-500">{lang === 'en' ? 'target conversions' : 'целевых переходов'}</span>
            </div>
          </div>

          {/* Card 4: Avg Conversion */}
          <div className="bg-neutral-900/80 border border-white/5 rounded-2xl p-5 shadow-xl hover:border-white/10 transition-all">
            <div className="flex items-center justify-between text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
              <span>{lang === 'en' ? 'Avg. Conversion' : 'Средняя конверсия'}</span>
              <svg className="w-4 h-4 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <div className="mt-3 text-3xl font-extrabold text-indigo-400 tracking-tight">
              {avgConversion}%
            </div>
            <div className="mt-2 text-[10px] text-indigo-300/80 font-medium">
              {lang === 'en' ? 'High conversion score' : 'Высокая эффективность'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Balance Block & Security Block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* BLOCK 2: Balance Block */}
        <div className="lg:col-span-1 bg-neutral-900/80 border border-white/5 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
                {lang === 'en' ? 'Personal Balance' : 'Баланс аккаунта'}
              </span>

              {/* Eye icon to toggle balance visibility */}
              <button
                onClick={toggleBalanceVisibility}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                title={isBalanceHidden ? (lang === 'en' ? 'Show balance' : 'Показать баланс') : (lang === 'en' ? 'Hide balance' : 'Скрыть баланс')}
              >
                {isBalanceHidden ? (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>

            {/* Display value */}
            <div className="py-2">
              <div className="text-3xl font-extrabold text-white tracking-tight font-mono">
                {isBalanceHidden ? '•••• ₽' : `${userBalance.toLocaleString('ru-RU')} ₽`}
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                {lang === 'en' ? 'Used for domain renewals and premium services.' : 'Используется для продления доменов и услуг.'}
              </p>
            </div>
          </div>

          {/* Top Up Button */}
          <button
            onClick={() => setIsTopUpOpen(true)}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>{lang === 'en' ? 'Top Up Balance' : 'Пополнить баланс'}</span>
          </button>
        </div>

        {/* BLOCK 3: Security & Credentials Block */}
        <div className="lg:col-span-2 bg-neutral-900/80 border border-white/5 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>{lang === 'en' ? 'Security & Account Credentials' : 'Безопасность и учетные данные'}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email Edit Section */}
            <form onSubmit={handleUpdateEmail} className="space-y-4">
              <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                {lang === 'en' ? 'Email Address' : 'Электронная почта'}
              </h3>
              <div>
                <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                  {lang === 'en' ? 'Account Email' : 'Email аккаунта'}
                </label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500/80 transition-colors"
                  placeholder="ivemaker@slmcards.io"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white font-bold text-xs rounded-xl transition-all border border-white/10 cursor-pointer"
              >
                {lang === 'en' ? 'Save Email' : 'Сохранить Email'}
              </button>
            </form>

            {/* Password Change Placeholders */}
            <form onSubmit={handleChangePassword} className="space-y-4">
              <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                {lang === 'en' ? 'Change Password' : 'Смена пароля'}
              </h3>
              <div className="space-y-2.5">
                <div>
                  <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                    {lang === 'en' ? 'Old Password' : 'Старый пароль'}
                  </label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500/80 transition-colors"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                    {lang === 'en' ? 'New Password' : 'Новый пароль'}
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500/80 transition-colors"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                    {lang === 'en' ? 'Confirm New Password' : 'Подтвердите новый пароль'}
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500/80 transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600/80 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md"
              >
                {lang === 'en' ? 'Update Password' : 'Обновить пароль'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* MODAL: Top Up Balance */}
      {isTopUpOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsTopUpOpen(false)} />
          <div className="relative bg-neutral-900 border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-5 animate-slide-up z-10 text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                <span>{lang === 'en' ? 'Top Up Balance' : 'Пополнение баланса'}</span>
              </h3>
              <button
                onClick={() => setIsTopUpOpen(false)}
                className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmTopUp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-2">
                  {lang === 'en' ? 'Enter Amount (₽)' : 'Сумма пополнения (₽)'}
                </label>
                <input
                  type="number"
                  min="50"
                  step="50"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-lg font-mono text-white focus:outline-none focus:border-indigo-500/80 transition-colors"
                  placeholder="500"
                  autoFocus
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-2">
                {['300', '500', '1000', '3000'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setTopUpAmount(preset)}
                    className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                      topUpAmount === preset
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-white/5 text-zinc-400 border-white/5 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {preset} ₽
                  </button>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsTopUpOpen(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  {lang === 'en' ? 'Cancel' : 'Отмена'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
                >
                  {lang === 'en' ? 'Confirm' : 'Пополнить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
