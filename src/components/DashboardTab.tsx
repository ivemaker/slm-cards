import React from 'react';
import { motion } from 'motion/react';
import { useDev, ProjectContacts, getDefaultContacts } from '../context/DevContext';
import { useToast } from '../context/ToastContext';
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
  ShoppingCart,
  DollarSign,
  UtensilsCrossed,
  Layers,
  User,
  ArrowUpRight,
  QrCode,
  Download,
  Copy,
  ExternalLink,
  Loader2,
  Lock,
  Share2,
  Phone,
  MapPin,
  Plus,
  Trash2,
  CheckCircle2,
  Send,
  Globe,
  Mail,
  Settings as SettingsIcon
} from 'lucide-react';

interface DashboardTabProps {
  lang: 'en' | 'ru';
}

const ProjectContactsSection: React.FC<{
  activeProject: any;
  updateProject: (id: string, updates: any) => void;
  lang: 'en' | 'ru';
  toastSuccess: (msg: string) => void;
  canEdit?: boolean;
}> = ({ activeProject, updateProject, lang, toastSuccess, canEdit = true }) => {
  const [localContacts, setLocalContacts] = React.useState<ProjectContacts>(() => {
    return activeProject?.contacts || getDefaultContacts(activeProject?.name || '');
  });

  React.useEffect(() => {
    if (activeProject?.contacts) {
      setLocalContacts(activeProject.contacts);
    } else if (activeProject?.name) {
      setLocalContacts(getDefaultContacts(activeProject.name));
    }
  }, [activeProject?.id, activeProject?.contacts]);

  const handleSaveAll = () => {
    updateProject(activeProject.id, { contacts: localContacts });
    toastSuccess(lang === 'en' ? 'Project contacts saved successfully!' : 'Контакты проекта успешно сохранены!');
  };

  const handleContactNameChange = (val: string) => {
    setLocalContacts(prev => ({ ...prev, contactName: val }));
  };

  const handleAddressChange = (val: string) => {
    setLocalContacts(prev => ({ ...prev, address: val }));
  };

  const handleAddMapLink = () => {
    setLocalContacts(prev => ({
      ...prev,
      mapLinks: [...(prev.mapLinks || []), { label: '', url: '' }]
    }));
  };

  const handleRemoveMapLink = (idx: number) => {
    setLocalContacts(prev => ({
      ...prev,
      mapLinks: (prev.mapLinks || []).filter((_, i) => i !== idx)
    }));
  };

  const handleMapLinkChange = (idx: number, field: 'label' | 'url', val: string) => {
    setLocalContacts(prev => ({
      ...prev,
      mapLinks: (prev.mapLinks || []).map((link, i) => i === idx ? { ...link, [field]: val } : link)
    }));
  };

  const sortPhones = (phones: any[]) => {
    const typeOrder: string[] = [];
    phones.forEach(p => {
      const l = p.label || '';
      if (!typeOrder.includes(l)) {
        typeOrder.push(l);
      }
    });
    return [...phones].sort((a, b) => {
      const idxA = typeOrder.indexOf(a.label || '');
      const idxB = typeOrder.indexOf(b.label || '');
      return idxA - idxB;
    });
  };

  const handlePhoneVisibilityChange = (idx: number, isVisible: boolean) => {
    setLocalContacts(prev => {
      const newPhones = prev.phones.map((p, i) => i === idx ? { ...p, isVisible } : p);
      return { ...prev, phones: newPhones };
    });
  };

  const handlePhoneChange = (idx: number, number: string) => {
    setLocalContacts(prev => {
      const newPhones = prev.phones.map((p, i) => i === idx ? { ...p, number: number.replace(/[^\d+]/g, '') } : p);
      return { ...prev, phones: newPhones };
    });
  };

  const handleAddDepartment = () => {
    setLocalContacts(prev => {
      const deptCount = new Set((prev.phones || []).map(p => p.label || '')).size;
      const newLabel = lang === 'en' ? `Department ${deptCount + 1}` : `Отдел ${deptCount + 1}`;
      const newPhones = [...prev.phones, { number: '', isPrimary: prev.phones.length === 0, label: newLabel, isVisible: true }];
      return { ...prev, phones: newPhones };
    });
  };

  const handleAddPhoneToDept = (label: string) => {
    setLocalContacts(prev => {
      const newPhones = [...prev.phones, { number: '', isPrimary: false, label, isVisible: true }];
      return { ...prev, phones: newPhones };
    });
  };

  const handleUpdateDeptLabel = (oldLabel: string, newLabel: string) => {
    setLocalContacts(prev => {
      const newPhones = prev.phones.map(p => (p.label || '') === oldLabel ? { ...p, label: newLabel } : p);
      return { ...prev, phones: newPhones };
    });
  };

  const handleSetPrimaryDept = (targetLabel: string) => {
    setLocalContacts(prev => {
      let found = false;
      const newPhones = prev.phones.map(p => {
        const isMatch = (p.label || '') === targetLabel;
        if (isMatch && !found) {
          found = true;
          return { ...p, isPrimary: true };
        }
        return { ...p, isPrimary: false };
      });
      return { ...prev, phones: newPhones };
    });
  };

  const handleRemoveDept = (targetLabel: string) => {
    setLocalContacts(prev => {
      let newPhones = prev.phones.filter(p => (p.label || '') !== targetLabel);
      if (newPhones.length > 0 && !newPhones.some(p => p.isPrimary)) {
        newPhones[0].isPrimary = true;
      }
      return { ...prev, phones: newPhones };
    });
  };

  const handleRemovePhoneItem = (idx: number) => {
    setLocalContacts(prev => {
      let newPhones = prev.phones.filter((_, i) => i !== idx);
      if (newPhones.length > 0 && !newPhones.some(p => p.isPrimary)) {
        newPhones[0].isPrimary = true;
      }
      return { ...prev, phones: newPhones };
    });
  };

  const handleSocialUrlChange = (idx: number, url: string) => {
    setLocalContacts(prev => {
      const newSocials = prev.socials.map((s, i) => i === idx ? { ...s, url } : s);
      return { ...prev, socials: newSocials };
    });
  };

  const handleSocialLabelChange = (idx: number, label: string) => {
    setLocalContacts(prev => {
      const newSocials = prev.socials.map((s, i) => i === idx ? { ...s, label } : s);
      return { ...prev, socials: newSocials };
    });
  };

  const defaultPrefixes: Record<string, string> = {
    telegram: 'https://t.me/',
    instagram: 'https://instagram.com/',
    whatsapp: 'https://wa.me/',
    vk: 'https://vk.com/',
    website: 'https://',
    email: ''
  };

  const sortSocials = (socials: any[]) => {
    const typeOrder = ['telegram', 'whatsapp', 'instagram', 'email', 'website', 'vk'];
    return [...socials].sort((a, b) => {
      const idxA = typeOrder.indexOf(a.type);
      const idxB = typeOrder.indexOf(b.type);
      return idxA - idxB;
    });
  };

  const handleAddSocial = (type: string) => {
    setLocalContacts(prev => {
      const initialUrl = defaultPrefixes[type] || '';
      const newSocials = sortSocials([...prev.socials, { type, url: initialUrl, label: '' }]);
      return { ...prev, socials: newSocials };
    });
  };

  const handleRemoveSocial = (idx: number) => {
    setLocalContacts(prev => {
      const newSocials = prev.socials.filter((_, i) => i !== idx);
      return { ...prev, socials: newSocials };
    });
  };

  const availableSocialTypes = [
    { type: 'telegram', label: 'Telegram' },
    { type: 'whatsapp', label: 'WhatsApp' },
    { type: 'instagram', label: 'Instagram' },
    { type: 'email', label: 'Email' },
    { type: 'website', label: 'Website' },
    { type: 'vk', label: 'ВКонтакте' }
  ];

  const currentTypes = localContacts.socials.map(s => s.type);
  const remainingTypes = availableSocialTypes.filter(t => !currentTypes.includes(t.type));

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden space-y-6">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none" />
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              {lang === 'en' ? 'Project Contacts & Socials' : 'Единые контакты проекта'}
            </h3>
            <p className="text-xs text-zinc-400">
              {lang === 'en' 
                ? 'Centralized contacts (phones, address, socials) for all cards & blocks' 
                : 'Единые данные поддержки, телефонов, физического адреса и соцсетей'}
            </p>
          </div>
        </div>
        <button 
          onClick={handleSaveAll}
          disabled={!canEdit}
          className={`px-5 py-2.5 ${canEdit ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-zinc-700 cursor-not-allowed'} text-white text-[11px] uppercase tracking-wider font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2`}
        >
          <CheckCircle2 className="w-4 h-4" />
          {lang === 'en' ? 'Save Contacts' : 'Сохранить контакты'}
        </button>
      </div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name & Address */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-400 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              {lang === 'en' ? 'Contact Name (vCard)' : 'Имя контакта для vCard'}
            </label>
            <input 
              type="text"
              value={localContacts.contactName || ''}
              onChange={e => handleContactNameChange(e.target.value)}
              placeholder={lang === 'en' ? 'e.g. Alexey Ivanov' : 'Например: Алексей Иванов'}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-zinc-200 font-medium focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              {lang === 'en' ? 'Physical Address (Google Maps Pin)' : 'Физический адрес (Геометка на карте)'}
            </label>
            <textarea 
              rows={2}
              value={localContacts.address || ''}
              onChange={e => handleAddressChange(e.target.value)}
              placeholder={lang === 'en' ? 'e.g. Moscow, Tverskaya St. 12' : 'Например: Москва, ул. Тверская, 12'}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-zinc-200 font-medium focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            />
            <p className="text-[10px] text-zinc-500 mt-1">
              {lang === 'en' 
                ? 'Creates an interactive Google Map modal pin in the Socials block automatically.'
                : 'Автоматически добавляет кнопку интерактивной карты в блок контактов при заполненном адресе.'}
            </p>

            {/* Map Links (Yandex, 2GIS, etc.) */}
            <div className="space-y-2 mt-4 pl-3 border-l-2 border-zinc-700">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-zinc-400 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-indigo-400" />
                  {lang === 'en' ? 'Map / Location Links (Yandex, 2GIS)' : 'Ссылки на карты (Яндекс, 2ГИС и др.)'}
                </label>
                <button
                  type="button"
                  onClick={handleAddMapLink}
                  className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {lang === 'en' ? 'Add Link' : 'Добавить ссылку'}
                </button>
              </div>
              
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {(localContacts.mapLinks || []).map((link, idx) => (
                  <div key={idx} className="bg-white/5 border border-white/10 p-2.5 rounded-xl flex flex-col gap-2 relative">
                    <div className="flex items-center gap-2">
                      <input 
                        type="text"
                        value={link.label}
                        onChange={e => handleMapLinkChange(idx, 'label', e.target.value)}
                        placeholder={lang === 'en' ? 'Service Name (e.g. Yandex Maps)' : 'Название (например: Яндекс Карты)'}
                        className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveMapLink(idx)}
                        className="p-1.5 text-zinc-400 hover:text-rose-400 transition-colors"
                        title={lang === 'en' ? 'Delete' : 'Удалить'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <input 
                      type="url"
                      value={link.url}
                      onChange={e => handleMapLinkChange(idx, 'url', e.target.value)}
                      placeholder={lang === 'en' ? 'URL Link to location' : 'Ссылка на локацию'}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                ))}
                {(localContacts.mapLinks || []).length === 0 && (
                  <p className="text-[10px] text-zinc-500 italic">
                    {lang === 'en' ? 'No custom map links added.' : 'Нет дополнительных ссылок на карты.'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Phones & Departments */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-zinc-400 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-indigo-400" />
              {lang === 'en' ? 'Phone Numbers & Departments' : 'Телефоны и отделы'}
            </label>
            <button
              type="button"
              onClick={handleAddDepartment}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors cursor-pointer bg-indigo-600/20 px-2.5 py-1 rounded-lg border border-indigo-500/30"
            >
              <Plus className="w-3.5 h-3.5" />
              {lang === 'en' ? 'Add Department' : 'Добавить отдел'}
            </button>
          </div>

          <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
            {(() => {
              const deptMap = new Map<string, { label: string; isMain: boolean; items: { idx: number; number: string; isPrimary: boolean; isVisible?: boolean }[] }>();
              (localContacts.phones || []).forEach((phone, idx) => {
                const label = phone.label || '';
                if (!deptMap.has(label)) {
                  deptMap.set(label, { label, isMain: false, items: [] });
                }
                const dept = deptMap.get(label)!;
                dept.items.push({ idx, number: phone.number, isPrimary: phone.isPrimary, isVisible: phone.isVisible });
                if (phone.isPrimary) dept.isMain = true;
              });

              const depts = Array.from(deptMap.values());
              depts.sort((a, b) => (b.isMain ? 1 : 0) - (a.isMain ? 1 : 0));

              return depts.map((dept, dIdx) => (
                <div key={dIdx} className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-3 shadow-sm">
                  {/* Department Header */}
                  <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                    <button
                      type="button"
                      onClick={() => handleSetPrimaryDept(dept.label)}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
                        dept.isMain 
                          ? 'bg-indigo-600 text-white shadow-xs' 
                          : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                      }`}
                      title={lang === 'en' ? 'Set department as main' : 'Сделать этот отдел основным'}
                    >
                      {dept.isMain && <CheckCircle2 className="w-3 h-3" />}
                      {dept.isMain 
                        ? (lang === 'en' ? 'Main' : 'Основной') 
                        : (lang === 'en' ? 'Make main' : 'Сделать осн.')}
                    </button>

                    <input
                      type="text"
                      value={dept.label}
                      onChange={e => handleUpdateDeptLabel(dept.label, e.target.value)}
                      placeholder={lang === 'en' ? 'Department name (e.g. Sales)' : 'Название отдела (например: Отдел продаж)'}
                      className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs font-bold text-zinc-200 focus:outline-none focus:border-indigo-500"
                    />

                    {depts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveDept(dept.label)}
                        className="p-1.5 text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer shrink-0"
                        title={lang === 'en' ? 'Remove department' : 'Удалить отдел'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Department Phone Numbers */}
                  <div className="space-y-2">
                    {dept.items.map((item, pIdx) => (
                      <div key={item.idx} className="flex items-center gap-2">
                        <label className="flex items-center gap-1 text-[11px] text-zinc-400 cursor-pointer select-none shrink-0" title={lang === 'en' ? 'Show in final view' : 'Показывать в финале'}>
                          <input
                            type="checkbox"
                            checked={item.isVisible !== false}
                            onChange={e => handlePhoneVisibilityChange(item.idx, e.target.checked)}
                            className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-[10px]">{lang === 'en' ? 'Show' : 'Показ.'}</span>
                        </label>

                        <input 
                          type="text"
                          value={item.number}
                          onChange={e => handlePhoneChange(item.idx, e.target.value)}
                          placeholder="+7 (999) 000-00-00"
                          className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 font-mono focus:outline-none focus:border-indigo-500"
                        />

                        <button
                          type="button"
                          onClick={() => handleAddPhoneToDept(dept.label)}
                          className="p-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 rounded-lg transition-colors cursor-pointer shrink-0 flex items-center justify-center border border-indigo-500/30"
                          title={lang === 'en' ? 'Add another number to this department' : 'Добавить номер в этот отдел'}
                        >
                          <Plus className="w-4 h-4" />
                        </button>

                        {dept.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemovePhoneItem(item.idx)}
                            className="p-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 rounded-lg transition-colors cursor-pointer shrink-0 flex items-center justify-center border border-rose-500/30"
                            title={lang === 'en' ? 'Remove this number' : 'Удалить этот номер'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      </div>

      {/* Socials & Messengers */}
      <div className="relative z-10 pt-4 border-t border-zinc-800 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-zinc-400 flex items-center gap-1.5">
            <Share2 className="w-3.5 h-3.5 text-indigo-400" />
            {lang === 'en' ? 'Social Networks & Links' : 'Социальные сети и ссылки'}
          </label>
          
          {remainingTypes.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap justify-end">
              <span className="text-[10px] text-zinc-500 font-bold uppercase mr-1">
                {lang === 'en' ? 'Add:' : 'Добавить:'}
              </span>
              {remainingTypes.map(st => (
                <button
                  key={st.type}
                  type="button"
                  onClick={() => handleAddSocial(st.type)}
                  className="px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-[10px] font-medium border border-zinc-700 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-2.5 h-2.5" />
                  {st.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(() => {
            const socialMap = new Map();
            localContacts.socials.forEach((s, idx) => {
              if (!socialMap.has(s.type)) {
                socialMap.set(s.type, { type: s.type, items: [] });
              }
              socialMap.get(s.type).items.push({ idx, label: s.label || '', url: s.url });
            });

            return Array.from(socialMap.values()).map((group, gIdx) => (
              <div key={gIdx} className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-3 shadow-sm">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-[10px] uppercase font-black text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md shrink-0">
                    {group.type}
                  </span>
                  
                  <button
                    type="button"
                    onClick={() => handleAddSocial(group.type)}
                    className="px-2 py-1 text-zinc-400 hover:text-indigo-400 transition-colors cursor-pointer shrink-0 flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 rounded border border-zinc-700"
                    title={lang === 'en' ? 'Add another' : 'Добавить ещё'}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-medium">{lang === 'en' ? 'Add link' : 'Добавить'}</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {group.items.map((item) => (
                    <div key={item.idx} className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={item.label}
                          onChange={e => handleSocialLabelChange(item.idx, e.target.value)}
                          placeholder={lang === 'en' ? 'Label (e.g. CEO, Support)' : 'Подпись (например: Руководитель, Общий)'}
                          className="flex-1 bg-zinc-950/50 border border-zinc-800/80 rounded-md px-2 py-1 text-[10px] text-zinc-300 focus:outline-none focus:border-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSocial(item.idx)}
                          className="p-1.5 text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer shrink-0"
                          title={lang === 'en' ? 'Remove' : 'Удалить'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input 
                        type="text"
                        value={item.url}
                        onChange={e => handleSocialUrlChange(item.idx, e.target.value)}
                        placeholder={
                          group.type === 'telegram' ? 'https://t.me/username' :
                          group.type === 'whatsapp' ? 'https://wa.me/79001234567' :
                          group.type === 'email' ? 'support@example.com' :
                          group.type === 'website' ? 'https://mywebsite.com' : 'URL or login'
                        }
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 font-mono focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ));
          })()}
        </div>
      </div>

      <div className="relative z-10 pt-4 border-t border-zinc-800 flex justify-end">
        <button
          type="button"
          onClick={handleSaveAll}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          {lang === 'en' ? 'Save Contacts' : 'Сохранить контакты'}
        </button>
      </div>
    </div>
  );
};

export const DashboardTab: React.FC<DashboardTabProps> = ({ lang }) => {
  const {
    activeProjectId,
    projects,
    setActiveTab,
    updateProject,
    getProjectUrl,
    dashboardSubTab: activeSubTab,
    setDashboardSubTab: setActiveSubTab
  } = useDev();

  const { success: toastSuccess, error: toastError } = useToast();
  const [isQrLoading, setIsQrLoading] = React.useState(true);

  const activeProject = projects.find(p => p.id === activeProjectId);
  
  const canEdit = activeProject?.userRole === 'owner' || activeProject?.userRole === 'full_editor';
  const canEditContacts = canEdit || activeProject?.userRole === 'contacts_editor';

  const [whatsappPhone, setWhatsappPhone] = React.useState(activeProject?.whatsappPhone || '');
  const [telegramUsername, setTelegramUsername] = React.useState(activeProject?.telegramUsername || '');

  const [showPublishModal, setShowPublishModal] = React.useState(false);
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    if (!activeProject || activeProject.tariff !== 'Basic' || !activeProject.premiumExpiredAt) {
      return;
    }
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 30000); // every 30 seconds
    return () => clearInterval(interval);
  }, [activeProject?.id, activeProject?.tariff, activeProject?.premiumExpiredAt]);

  const getGracePeriodTimeLeft = () => {
    if (!activeProject || activeProject.tariff !== 'Basic' || !activeProject.premiumExpiredAt) {
      return null;
    }
    const expiredDate = new Date(activeProject.premiumExpiredAt).getTime();
    const GRACE_PERIOD_MS = 7 * 24 * 60 * 60 * 1000;
    const timeLeftMs = GRACE_PERIOD_MS - (Date.now() - expiredDate);

    if (timeLeftMs <= 0) {
      return null;
    }

    const totalHours = Math.floor(timeLeftMs / (1000 * 60 * 60));
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;

    return { days, hours };
  };

  const timeLeft = getGracePeriodTimeLeft();

  const handlePublishClick = () => {
    if (!activeProject) return;
    setShowPublishModal(true);
  };

  const handleConfirmPublish = () => {
    if (activeProjectId) {
      updateProject(activeProjectId, { hasUnpublishedChanges: false });
      toastSuccess(lang === 'en' ? 'Project published successfully!' : 'Проект успешно опубликован!');
    }
    setShowPublishModal(false);
  };

  React.useEffect(() => {
    setWhatsappPhone(activeProject?.whatsappPhone || '');
    setTelegramUsername(activeProject?.telegramUsername || '');
  }, [activeProject?.id, activeProject?.whatsappPhone, activeProject?.telegramUsername]);

  const handleSaveOrders = () => {
    if (activeProjectId) {
      updateProject(activeProjectId, {
        whatsappPhone,
        telegramUsername
      });
      toastSuccess(lang === 'en' ? 'Orders settings saved!' : 'Настройки приема заказов сохранены!');
    }
  };

  React.useEffect(() => {
    setIsQrLoading(true);
  }, [activeProject?.id, activeProject?.type]);

  const projectUrl = activeProject ? getProjectUrl(activeProject) : '';

  const qrColor = '6366f1'; 
  const qrBgColor = '1e1b4b'; 
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(projectUrl)}&color=${qrColor}&bgcolor=${qrBgColor}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(projectUrl)
      .then(() => toastSuccess(lang === 'en' ? 'Link copied to clipboard!' : 'Ссылка скопирована!'))
      .catch(() => toastError(lang === 'en' ? 'Failed to copy' : 'Ошибка копирования'));
  };

  const handleDownloadQr = async () => {
    try {
      const response = await fetch(qrSrc);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `slm-qr-${activeProject?.id || 'code'}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      toastError(lang === 'en' ? 'Failed to download QR code' : 'Ошибка при скачивании QR-кода');
    }
  };

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
        
        {/* Header with Project Details and SubTab Switcher */}
        {activeSubTab === 'analytics' ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-wider uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                  {lang === 'en' ? 'Analytics Suite' : 'Аналитика'}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${
                  activeProject.plan === 'premium'
                    ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    : activeProject.plan === 'unpaid'
                    ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                    : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                }`}>
                  {activeProject.plan === 'premium' ? '👑 Premium' : activeProject.plan === 'unpaid' ? 'Unpaid' : 'Standard'}
                </span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 mt-1 flex items-center gap-2">
                {lang === 'en' ? 'Analytics' : 'Аналитика'} / <span className="text-indigo-600 font-extrabold">{activeProject.name}</span>
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                {lang === 'en' 
                  ? 'Real-time performance metrics synchronized with your custom layouts.' 
                  : 'Показатели посещений и действий посетителей для вашего выбранного макета.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveSubTab('project_settings')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <SettingsIcon className="w-4 h-4" />
                {lang === 'en' ? 'Project Settings' : 'Настройки проекта'}
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className="px-3.5 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-950 text-xs font-semibold rounded-lg border border-zinc-200 transition-all cursor-pointer flex items-center gap-1"
              >
                {lang === 'en' ? 'Switch Project' : 'Сменить проект'}
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-wider uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                  {lang === 'en' ? 'Configuration' : 'Конфигурация'}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${
                  activeProject.plan === 'premium'
                    ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    : activeProject.plan === 'unpaid'
                    ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                    : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                }`}>
                  {activeProject.plan === 'premium' ? '👑 Premium' : activeProject.plan === 'unpaid' ? 'Unpaid' : 'Standard'}
                </span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 mt-1 flex items-center gap-2">
                {lang === 'en' ? 'Project Settings' : 'Настройки проекта'} / <span className="text-indigo-600 font-extrabold">{activeProject.name}</span>
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                {lang === 'en' 
                  ? 'Manage contact details, order notifications, and publish configuration.' 
                  : 'Управление контактами, уведомлениями о заказах и публикацией.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveSubTab('analytics')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <TrendingUp className="w-4 h-4" />
                {lang === 'en' ? 'Analytics' : 'Аналитика'}
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className="px-3.5 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-950 text-xs font-semibold rounded-lg border border-zinc-200 transition-all cursor-pointer flex items-center gap-1"
              >
                {lang === 'en' ? 'Switch Project' : 'Сменить проект'}
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* SubTab Content */}
        {activeSubTab === 'analytics' ? (
          <div className="space-y-6">
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

                    {/* Right Column: Visual Sales Funnel */}
                    <div className="space-y-2.5">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                        {lang === 'en' ? 'Checkout Funnel Efficiency' : 'Уровни воронки заказов'}
                      </span>

                      <div className="w-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-lg p-3 flex justify-between items-center text-xs font-semibold">
                        <span className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-indigo-400" />
                          {lang === 'en' ? '1. Item Views' : '1. Просмотры товаров'}
                        </span>
                        <span className="font-mono font-bold text-white">100% ({views})</span>
                      </div>

                      <div className="w-[65%] bg-purple-500/10 border border-purple-500/20 text-purple-300 rounded-lg p-3 flex justify-between items-center text-xs font-semibold shadow-md">
                        <span className="flex items-center gap-2 truncate">
                          <ShoppingBag className="w-4 h-4 text-purple-400" />
                          {lang === 'en' ? '2. Added to Cart' : '2. Добавлено в корзину'}
                        </span>
                        <span className="font-mono font-bold text-white shrink-0">65%</span>
                      </div>

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

            {/* STEP 6: General Device Breakdown */}
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

              <div className="flex justify-between items-center pt-1 text-xs">
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
          </div>
        ) : (
          <div className="space-y-6">
            {/* Unified Project Contacts Section */}
            {activeProject && (
              <ProjectContactsSection 
                activeProject={activeProject}
                updateProject={updateProject}
                lang={lang}
                toastSuccess={toastSuccess}
                canEdit={canEditContacts}
              />
            )}

            {/* Dynamic QR Code & Links section */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />

              <div className="space-y-6 flex-1 w-full relative z-10">
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <QrCode className="w-5 h-5 text-indigo-500" />
                      {lang === 'en' ? 'Publish & Share' : 'Публикация проекта'}
                    </h3>
                    <button
                      onClick={handlePublishClick}
                      disabled={!activeProject?.hasUnpublishedChanges}
                      className={`px-6 py-2 font-bold rounded-xl text-sm transition-all shadow-lg ${
                        activeProject?.hasUnpublishedChanges
                          ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20 active:scale-[0.98]'
                          : 'bg-zinc-800 text-zinc-500 cursor-not-allowed shadow-none'
                      }`}
                    >
                      {lang === 'en' ? 'Publish' : 'Опубликовать'}
                    </button>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed max-w-md">
                    {activeProject?.hasUnpublishedChanges
                      ? (lang === 'en' 
                          ? 'You have unpublished changes. Publish to make them visible.' 
                          : 'У вас есть неопубликованные изменения. Опубликуйте, чтобы они стали доступны.')
                      : (lang === 'en' 
                          ? 'Your project is live! Share this unique link with your audience or print the QR code.' 
                          : 'Проект опубликован! Делитесь этой ссылкой с аудиторией или используйте QR-код.')}
                  </p>
                </div>

                {activeProject?.plan !== 'unpaid' && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider pl-1">
                      {lang === 'en' ? 'Direct Link' : 'Прямая ссылка'}
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 flex items-center shadow-inner">
                        <input 
                          type="text" 
                          readOnly 
                          value={projectUrl}
                          className="bg-transparent border-none outline-none text-sm text-zinc-200 font-mono w-full truncate selection:bg-indigo-500/30"
                        />
                      </div>
                      <button 
                        onClick={handleCopyLink}
                        title={lang === 'en' ? 'Copy link' : 'Скопировать ссылку'}
                        className="shrink-0 p-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 rounded-xl text-zinc-300 transition-all cursor-pointer group"
                      >
                        <Copy className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </button>
                      <a 
                        href={projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={lang === 'en' ? 'Open in new tab' : 'Открыть в новой вкладке'}
                        className="shrink-0 p-3 bg-indigo-600 hover:bg-indigo-500 border border-indigo-500 hover:border-indigo-400 rounded-xl text-white transition-all cursor-pointer group shadow-lg shadow-indigo-600/20"
                      >
                        <ExternalLink className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </a>
                    </div>
                    {timeLeft && (
                      <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-500 font-light" id="grace-period-timer">
                        <span>⏳ {lang === 'en' ? `Domain will turn off in: ${timeLeft.days} d. ${timeLeft.hours} h.` : `Домен отключится через: ${timeLeft.days} д. ${timeLeft.hours} ч.`}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {activeProject?.plan !== 'unpaid' && (
                <div className="shrink-0 flex flex-col sm:flex-row items-center gap-6 bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl relative z-10 w-full md:w-auto mt-6 md:mt-0">
                  <div className="w-36 h-36 rounded-xl bg-zinc-950 border border-white/10 flex items-center justify-center p-2 shadow-inner relative overflow-hidden">
                    {isQrLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-zinc-950 z-10">
                        <div className="w-full h-full bg-zinc-800 animate-pulse" />
                        <Loader2 className="absolute w-6 h-6 text-indigo-500 animate-spin" />
                      </div>
                    )}
                    <img 
                      src={qrSrc} 
                      alt="Project QR Code" 
                      className={`w-full h-full object-contain rounded-lg transition-opacity duration-500 ${isQrLoading ? 'opacity-0' : 'opacity-100'}`}
                      onLoad={() => setIsQrLoading(false)}
                      onError={() => setIsQrLoading(false)}
                    />
                  </div>

                  <div className="flex flex-col gap-3 w-full sm:w-auto">
                    <div className="text-center sm:text-left space-y-0.5">
                      <span className="block text-sm font-bold text-zinc-200">
                        {lang === 'en' ? 'Smart QR Code' : 'Умный QR-код'}
                      </span>
                      <span className="block text-xs text-zinc-500">
                        {lang === 'en' ? 'High-res • Indigo' : 'Высокое качество'}
                      </span>
                    </div>
                    <button 
                      onClick={handleDownloadQr}
                      className="w-full sm:w-auto px-5 py-2.5 bg-zinc-100 hover:bg-white text-zinc-900 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95"
                    >
                      <Download className="w-4 h-4" />
                      {lang === 'en' ? 'Download QR' : 'Скачать QR'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}



      </div>

      {showPublishModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" onClick={() => setShowPublishModal(false)} />
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-slide-up">
            <h3 className="text-xl font-bold text-white mb-4">
              {activeProject?.plan === 'premium' ? (lang === 'en' ? 'Confirm Publication' : 'Подтверждение публикации')
               : activeProject?.plan === 'unpaid' ? (lang === 'en' ? 'Choose Plan' : 'Выберите тариф')
               : (lang === 'en' ? 'Confirm Publication' : 'Подтверждение публикации')}
            </h3>
            
            <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
              {activeProject?.plan === 'premium' ? (
                lang === 'en' ? 'Are you sure you want to publish your changes? They will be immediately visible to your audience.' : 'Вы уверены, что хотите опубликовать изменения? Они сразу станут доступны вашей аудитории.'
              ) : activeProject?.plan === 'unpaid' ? (
                lang === 'en' ? 'You need to upgrade to a Standard or Premium plan to publish this project.' : 'Для публикации проекта необходимо приобрести тариф Стандарт или Премиум.'
              ) : (
                lang === 'en' ? 'Publishing with Standard plan will disable some advanced premium animations on your card. Do you want to publish anyway, or upgrade to Premium?' : 'При публикации на тарифе Стандарт некоторые премиальные анимации будут отключены. Опубликовать в любом случае или перейти на Премиум?'
              )}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 justify-end">
              <button
                onClick={() => setShowPublishModal(false)}
                className="w-full sm:w-auto px-4 py-2 text-sm font-bold text-zinc-400 hover:text-white transition-colors"
              >
                {lang === 'en' ? 'Cancel' : 'Отмена'}
              </button>
              
              {activeProject?.plan === 'unpaid' ? (
                <>
                  <button
                    onClick={() => {
                      toastSuccess(lang === 'en' ? 'Redirecting to payment...' : 'Перенаправление на оплату...');
                      setShowPublishModal(false);
                    }}
                    className="w-full sm:w-auto px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl text-sm transition-all"
                  >
                    {lang === 'en' ? 'Buy Standard' : 'Купить Стандарт'}
                  </button>
                  <button
                    onClick={() => {
                      toastSuccess(lang === 'en' ? 'Redirecting to payment...' : 'Перенаправление на оплату...');
                      setShowPublishModal(false);
                    }}
                    className="w-full sm:w-auto px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    {lang === 'en' ? 'Buy Premium' : 'Купить Премиум'}
                  </button>
                </>
              ) : activeProject?.plan === 'premium' ? (
                <button
                  onClick={handleConfirmPublish}
                  className="w-full sm:w-auto px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/20"
                >
                  {lang === 'en' ? 'Publish' : 'Опубликовать'}
                </button>
              ) : (
                <>
                  <button
                    onClick={handleConfirmPublish}
                    className="w-full sm:w-auto px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl text-sm transition-all"
                  >
                    {lang === 'en' ? 'Publish (Standard)' : 'Опубликовать (Стандарт)'}
                  </button>
                  <button
                    onClick={() => {
                      toastSuccess(lang === 'en' ? 'Redirecting to payment...' : 'Перенаправление на оплату...');
                      setShowPublishModal(false);
                    }}
                    className="w-full sm:w-auto px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    {lang === 'en' ? 'Upgrade to Premium' : 'Оплатить Премиум'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
