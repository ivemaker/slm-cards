import React from 'react';
import { motion } from 'motion/react';
import { useDev } from '../context/DevContext';
import {
  TrendingUp,
  Smartphone,
  Monitor,
  Eye,
  Users,
  Clock,
  Percent,
  FolderOpen,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  DollarSign,
  UtensilsCrossed,
  Layers,
  User,
  ArrowUpRight,
  QrCode,
  Download
} from 'lucide-react';

interface DashboardTabProps {
  lang: 'en' | 'ru';
}

export const DashboardTab: React.FC<DashboardTabProps> = ({ lang }) => {
  const {
    activeProjectId,
    projects,
    setActiveTab
  } = useDev();

  const activeProject = projects.find(p => p.id === activeProjectId);

  // STEP 2: Placeholder if no active project
  if (!activeProjectId || !activeProject) {
    return (
      <div className="flex-1 w-full px-4 sm:px-6 md:px-8 py-8 animate-fade-in relative z-10 overflow-y-auto">
        <div className="max-w-2xl mx-auto mt-12">
          <div className="bg-zinc-950 border border-zinc-850 p-8 sm:p-12 rounded-2xl shadow-2xl flex flex-col items-center text-center space-y-6">
            {/* Rocking emoji 📊 */}
            <motion.div
              animate={{ rotate: [0, -6, 6, -6, 6, 0] }}
              transition={{
                repeat: Infinity,
                duration: 4,
                ease: 'easeInOut',
                repeatDelay: 2
              }}
              className="w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-4xl shadow-xl"
            >
              📊
            </motion.div>
            
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                {lang === 'en' ? 'No Active Project Selected' : 'Нет активного проекта для анализа'}
              </h3>
              <p className="text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
                {lang === 'en'
                  ? 'Please select a project in the "Projects" tab to view detailed visitor analytics, click stats, and conversion funnels.'
                  : 'Выберите проект во вкладке «Проекты», чтобы просмотреть подробную статистику посещений, кликов и заказов.'}
              </p>
            </div>

            <button
              onClick={() => setActiveTab('projects')}
              id="btn-dashboard-to-projects"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-indigo-600/15 border border-indigo-500 hover:shadow-indigo-500/25 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{lang === 'en' ? 'Go to Projects' : 'Перейти к проектам'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STEP 3: Stable pseudo-random number generator
  const getStableNumber = (id: string, multiplier: number, min: number = 0) => {
    const seed = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return min + (seed * multiplier) % 1000;
  };

  // Generate metrics based on project ID
  const views = getStableNumber(activeProject.id, 7, 450); // range: 450 - 1450
  const uniqueRatio = 0.7 + (getStableNumber(activeProject.id, 3, 0) % 15) / 100; // 0.70 - 0.85
  const uniqueVisitors = Math.round(views * uniqueRatio);
  
  // session duration
  const minSeconds = 90 + (getStableNumber(activeProject.id, 11, 0) % 120); // 90 - 210s
  const durationMinutes = Math.floor(minSeconds / 60);
  const durationSeconds = minSeconds % 60;
  const avgDuration = `${durationMinutes}m ${durationSeconds}s`;

  // CTR
  const ctrVal = 5.2 + (getStableNumber(activeProject.id, 17, 0) % 110) / 10; // 5.2% - 16.2%
  const ctr = `${ctrVal.toFixed(1)}%`;

  // Total conversions / clicks for button/sales analysis
  const totalClicks = Math.max(12, Math.round(views * (ctrVal / 100)));

  return (
    <div className="flex-1 w-full px-4 sm:px-6 md:px-8 py-8 animate-fade-in relative z-10 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header with Project Details */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-wider uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                {lang === 'en' ? 'Analytics Suite' : 'Аналитика'}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${
                activeProject.plan === 'premium'
                  ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                  : 'bg-zinc-100 text-zinc-500 border-zinc-200'
              }`}>
                {activeProject.plan === 'premium' ? '👑 Premium' : 'Standard'}
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 mt-1 flex items-center gap-2">
              {lang === 'en' ? 'Performance:' : 'Эффективность:'} <span className="text-indigo-600 font-extrabold">{activeProject.name}</span>
            </h2>
            <p className="text-xs text-zinc-500 mt-1">
              {lang === 'en' 
                ? 'Real-time performance metrics synchronized with your custom layouts.' 
                : 'Показатели посещений и действий посетителей для вашего выбранного макета.'}
            </p>
          </div>

          <button
            onClick={() => setActiveTab('projects')}
            className="self-start sm:self-center px-3.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-950 text-xs font-semibold rounded-lg border border-zinc-200 transition-all cursor-pointer flex items-center gap-1"
          >
            {lang === 'en' ? 'Switch Project' : 'Сменить проект'}
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* STEP 4: General indicators grid (4 top cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Views */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-xl hover:border-zinc-750 transition-all">
            <div className="flex justify-between items-start text-zinc-500">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {lang === 'en' ? 'Total Views' : 'Просмотры'}
              </span>
              <Eye className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="mt-2 text-3xl font-extrabold text-white tracking-tight">
              {views.toLocaleString()}
            </div>
            <p className="text-[10px] text-emerald-400 font-bold mt-1.5 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +14.3% {lang === 'en' ? 'vs last week' : 'за неделю'}
            </p>
          </div>

          {/* Card 2: Unique Visitors */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-xl hover:border-zinc-750 transition-all">
            <div className="flex justify-between items-start text-zinc-500">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {lang === 'en' ? 'Unique Visitors' : 'Посетители'}
              </span>
              <Users className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="mt-2 text-3xl font-extrabold text-white tracking-tight">
              {uniqueVisitors.toLocaleString()}
            </div>
            <p className="text-[10px] text-emerald-400 font-bold mt-1.5 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +8.9% {lang === 'en' ? 'vs last week' : 'за неделю'}
            </p>
          </div>

          {/* Card 3: Avg Session Duration */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-xl hover:border-zinc-750 transition-all">
            <div className="flex justify-between items-start text-zinc-500">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {lang === 'en' ? 'Avg. Duration' : 'Время сессии'}
              </span>
              <Clock className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="mt-2 text-3xl font-extrabold text-white tracking-tight">
              {avgDuration}
            </div>
            <p className="text-[10px] text-zinc-550 font-semibold mt-1.5">
              {lang === 'en' ? 'Optimal retention depth' : 'Оптимальная глубина задержки'}
            </p>
          </div>

          {/* Card 4: CTR / Conversion Rate */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-xl hover:border-zinc-750 transition-all">
            <div className="flex justify-between items-start text-zinc-500">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {lang === 'en' ? 'Conversion Rate' : 'Конверсия (CTR)'}
              </span>
              <Percent className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="mt-2 text-3xl font-extrabold text-white tracking-tight">
              {ctr}
            </div>
            <p className="text-[10px] text-emerald-400 font-bold mt-1.5 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +2.1% {lang === 'en' ? 'vs last week' : 'за неделю'}
            </p>
          </div>

        </div>

        {/* STEP 5: Specific analysis depending on activeProject.type */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl text-white">
          
          {/* PERSONAL CARD TYPE */}
          {activeProject.type === 'personal_card' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {lang === 'en' ? 'Contact Button Clicks Breakdown' : 'Статистика кликов по кнопкам связи'}
                    </h3>
                    <p className="text-xs text-zinc-550">
                      {lang === 'en' ? 'Breakdown of primary CTA actions chosen by your visitors.' : 'Подробный анализ кликов на мессенджеры и ссылки связи.'}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-zinc-400 font-mono">
                  {totalClicks} {lang === 'en' ? 'clicks' : 'кликов'}
                </span>
              </div>

              {/* Progress bars of 4 items */}
              <div className="space-y-4 pt-2">
                {[
                  { name: 'Telegram', clicks: Math.round(totalClicks * 0.45), percent: 45, color: 'from-sky-500 to-blue-600', hoverBg: 'hover:bg-sky-500/5' },
                  { name: 'WhatsApp', clicks: Math.round(totalClicks * 0.25), percent: 25, color: 'from-emerald-500 to-green-600', hoverBg: 'hover:bg-emerald-500/5' },
                  { name: 'Instagram', clicks: Math.round(totalClicks * 0.18), percent: 18, color: 'from-pink-500 to-purple-600', hoverBg: 'hover:bg-pink-500/5' },
                  { name: 'Phone / Call', clicks: Math.round(totalClicks * 0.12), percent: 12, color: 'from-amber-500 to-orange-600', hoverBg: 'hover:bg-amber-500/5' },
                ].map((item, idx) => (
                  <div key={idx} className={`p-2.5 rounded-xl border border-transparent ${item.hoverBg} transition-all space-y-2`}>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-zinc-200">{item.name}</span>
                      <div className="space-x-2 font-mono">
                        <span className="text-zinc-300 font-semibold">{item.clicks} {lang === 'en' ? 'clicks' : 'кликов'}</span>
                        <span className="text-zinc-500">({item.percent}%)</span>
                      </div>
                    </div>
                    {/* HTML Progress bar */}
                    <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000`} 
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MENU TYPE */}
          {activeProject.type === 'menu' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {lang === 'en' ? 'Popular Dishes and Menu Sections' : 'Популярные блюда и разделы меню'}
                  </h3>
                  <p className="text-xs text-zinc-550">
                    {lang === 'en' ? 'Most-viewed culinary items selected by your smartphone guests.' : 'Наиболее заказываемые и открываемые разделы электронного меню.'}
                  </p>
                </div>
              </div>

              {/* Table / List of top 4 positions */}
              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-500 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-1">{lang === 'en' ? 'Dish Name' : 'Блюдо / Раздел'}</th>
                      <th className="py-3 px-3 text-center">{lang === 'en' ? 'Category' : 'Категория'}</th>
                      <th className="py-3 px-3 text-right">{lang === 'en' ? 'Impressions' : 'Просмотры'}</th>
                      <th className="py-3 px-4 text-right">{lang === 'en' ? 'Action' : 'Действие'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-850">
                    {[
                      { 
                        name: lang === 'en' ? 'Pizza Margherita' : 'Пицца Маргарита', 
                        emoji: '🍕',
                        category: lang === 'en' ? 'Pizzas' : 'Пицца',
                        views: Math.round(views * 0.25 + (getStableNumber(activeProject.id, 20) % 50)),
                        gradient: 'from-amber-500 to-red-500' 
                      },
                      { 
                        name: lang === 'en' ? 'Pasta Carbonara' : 'Паста Карбонара', 
                        emoji: '🍝',
                        category: lang === 'en' ? 'Pasta' : 'Паста',
                        views: Math.round(views * 0.18 + (getStableNumber(activeProject.id, 21) % 30)),
                        gradient: 'from-amber-600 to-yellow-500' 
                      },
                      { 
                        name: lang === 'en' ? 'Chef Burger' : 'Бургер Шеф', 
                        emoji: '🍔',
                        category: lang === 'en' ? 'Burgers' : 'Бургеры',
                        views: Math.round(views * 0.14 + (getStableNumber(activeProject.id, 22) % 20)),
                        gradient: 'from-orange-500 to-red-600' 
                      },
                      { 
                        name: lang === 'en' ? 'Classic Lemonade' : 'Лимонад Классический', 
                        emoji: '🍋',
                        category: lang === 'en' ? 'Beverages' : 'Напитки',
                        views: Math.round(views * 0.10 + (getStableNumber(activeProject.id, 23) % 15)),
                        gradient: 'from-yellow-400 to-lime-500' 
                      }
                    ].map((dish, idx) => (
                      <tr key={idx} className="hover:bg-zinc-850/30 transition-colors group">
                        <td className="py-3.5 px-1 flex items-center gap-3">
                          {/* Glowing avatar with emoji */}
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${dish.gradient} flex items-center justify-center text-sm shadow-md font-sans`}>
                            {dish.emoji}
                          </div>
                          <span className="font-semibold text-zinc-200 group-hover:text-white transition-colors">{dish.name}</span>
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span className="bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded text-[10px] font-semibold border border-zinc-750">
                            {dish.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono font-bold text-zinc-300">
                          {dish.views}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button className="px-2.5 py-1 bg-zinc-800 hover:bg-indigo-600 hover:text-white text-zinc-400 text-[11px] font-bold rounded-md transition-all border border-zinc-700 hover:border-indigo-500 cursor-pointer">
                            {lang === 'en' ? 'View' : 'Посмотреть'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CATALOG TYPE */}
          {activeProject.type === 'catalog' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-lg">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {lang === 'en' ? 'Financial Metrics and Sales Funnel' : 'Финансовые метрики и воронка продаж'}
                  </h3>
                  <p className="text-xs text-zinc-550">
                    {lang === 'en' ? 'Comprehensive analytical metrics and step-by-step checkout funnel.' : 'Финансовая сводка, корзины и процент удержания в воронке заказов.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* Left Column: Financial Card */}
                <div className="bg-zinc-950/40 border border-zinc-850 rounded-xl p-5 space-y-4 flex flex-col justify-center">
                  
                  {/* Revenue */}
                  <div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                      {lang === 'en' ? 'Total Revenue' : 'Общая выручка'}
                    </span>
                    <div className="text-2xl font-extrabold text-emerald-400 tracking-tight mt-1 flex items-center gap-1.5">
                      <DollarSign className="w-6 h-6 shrink-0" />
                      {lang === 'en' 
                        ? `${(totalClicks * (35 + (getStableNumber(activeProject.id, 33) % 45))).toLocaleString()}` 
                        : `${(totalClicks * (2500 + (getStableNumber(activeProject.id, 33) % 2000))).toLocaleString()} ₽`}
                    </div>
                  </div>

                  {/* Other metrics */}
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-zinc-850">
                    <div>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                        {lang === 'en' ? 'Cart Adds' : 'Добавлений в корзину'}
                      </span>
                      <div className="text-lg font-bold text-zinc-200 mt-1 font-mono">
                        {Math.round(totalClicks * 2.4)}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                        {lang === 'en' ? 'Orders Checked Out' : 'Оформлено заказов'}
                      </span>
                      <div className="text-lg font-bold text-zinc-200 mt-1 font-mono">
                        {totalClicks}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Column: Visual Sales Funnel (HTML + Tailwind) */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                    {lang === 'en' ? 'Checkout Funnel Efficiency' : 'Уровни воронки заказов'}
                  </span>

                  {/* Step 1: Views (100% width) */}
                  <div className="w-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-lg p-3 flex justify-between items-center text-xs font-semibold">
                    <span className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-indigo-400" />
                      {lang === 'en' ? '1. Item Views' : '1. Просмотры товаров'}
                    </span>
                    <span className="font-mono font-bold text-white">100% ({views})</span>
                  </div>

                  {/* Step 2: In Cart (65% width) */}
                  <div className="w-[65%] bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-lg p-3 flex justify-between items-center text-xs font-semibold shadow-md">
                    <span className="flex items-center gap-2 truncate">
                      <ShoppingBag className="w-4 h-4 text-purple-400" />
                      {lang === 'en' ? '2. Added to Cart' : '2. Добавлено в корзину'}
                    </span>
                    <span className="font-mono font-bold text-white shrink-0">65%</span>
                  </div>

                  {/* Step 3: Purchase (25% width) */}
                  <div className="w-[32%] bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 rounded-lg p-3 flex justify-between items-center text-xs font-semibold shadow-lg">
                    <span className="flex items-center gap-2 truncate">
                      <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                      {lang === 'en' ? '3. Purchased' : '3. Оплачено'}
                    </span>
                    <span className="font-mono font-bold text-white shrink-0">25%</span>
                  </div>

                </div>

              </div>
            </div>
          )}

        </div>

        {/* STEP 6: General Device Breakdown (Mobile vs Desktop indicator) */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl text-white space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">
                {lang === 'en' ? 'Device Breakdown' : 'Типы устройств'}
              </h3>
              <p className="text-xs text-zinc-550">
                {lang === 'en' ? 'Platform architecture utilized by your digital card visitors.' : 'Разбивка по мобильным и десктопным посетителям сайта.'}
              </p>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-900/40 px-2 py-0.5 rounded">
              {lang === 'en' ? 'Optimized for Mobile first' : 'Мобильные в приоритете'}
            </span>
          </div>

          {/* Horizontal multi-color progress indicator bar */}
          <div className="w-full h-3.5 bg-zinc-800 rounded-full overflow-hidden flex shadow-inner">
            <div 
              className="bg-indigo-600 hover:bg-indigo-500 transition-colors h-full" 
              style={{ width: '88%' }}
              title="Mobile Users: 88%"
            />
            <div 
              className="bg-zinc-600 hover:bg-zinc-500 transition-colors h-full" 
              style={{ width: '12%' }}
              title="Desktop Users: 12%"
            />
          </div>

          {/* Legend and stats */}
          <div className="flex justify-between items-center pt-1 text-xs">
            {/* Mobile indicator */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-md">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-zinc-300 block leading-tight">
                  {lang === 'en' ? 'Mobile' : 'Мобильные'}
                </span>
                <span className="text-[11px] text-zinc-500 font-mono">88%</span>
              </div>
            </div>

            {/* Desktop indicator */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 shadow-md">
                <Monitor className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-zinc-300 block leading-tight">
                  {lang === 'en' ? 'Desktop' : 'Компьютеры'}
                </span>
                <span className="text-[11px] text-zinc-500 font-mono">12%</span>
              </div>
            </div>
          </div>

        </div>

        {/* Dynamic QR Code & Links section as secondary stats details */}
        <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-md">
            <h3 className="text-base font-bold text-zinc-900 flex items-center gap-1.5">
              <QrCode className="w-5 h-5 text-indigo-600" />
              {lang === 'en' ? 'Interactive Project QR Code' : 'QR-код для визиток и рекламы'}
            </h3>
            <p className="text-xs text-zinc-550 leading-relaxed">
              {lang === 'en' 
                ? 'Print your custom vector QR code to place on physical cards, table stands, stickers, or catalogs for immediate scanning.' 
                : 'Размещайте этот QR-код на меню ресторана, столах, фирменных наклейках или бумажных буклетах для быстрого сканирования.'}
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="w-24 h-24 bg-zinc-50 border border-zinc-200 rounded-xl p-2 flex items-center justify-center shadow-inner">
              {/* Dummy styled grid lines mimicking QR */}
              <div className="w-full h-full border-2 border-zinc-900 rounded p-1 flex flex-wrap gap-1 bg-white">
                <div className="w-5 h-5 bg-zinc-900 rounded-sm" />
                <div className="w-5 h-5 bg-transparent" />
                <div className="w-5 h-5 bg-zinc-900 rounded-sm" />
                <div className="w-5 h-5 bg-transparent" />
                <div className="w-5 h-5 bg-zinc-900 rounded-sm" />
                <div className="w-5 h-5 bg-zinc-900 rounded-sm" />
                <div className="w-5 h-5 bg-zinc-900 rounded-sm" />
                <div className="w-5 h-5 bg-transparent" />
                <div className="w-5 h-5 bg-zinc-900 rounded-sm" />
              </div>
            </div>

            <div className="space-y-2">
              <button className="w-full px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow cursor-pointer">
                <Download className="w-3.5 h-3.5" />
                {lang === 'en' ? 'Download Vector' : 'Скачать векторный'}
              </button>
              <button className="w-full px-3.5 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 border border-zinc-200 cursor-pointer">
                <Download className="w-3.5 h-3.5" />
                {lang === 'en' ? 'Print Label' : 'Печать наклейки'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
