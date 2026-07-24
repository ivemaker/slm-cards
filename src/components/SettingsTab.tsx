import React, { useState, useEffect } from 'react';
import { useDev, MockProject, ProjectContacts, getDefaultContacts } from '../context/DevContext';
import { 
  Settings as SettingsIcon, 
  User, 
  Shield, 
  HelpCircle,
  Phone,
  MapPin,
  Share2,
  Plus,
  Trash2,
  CheckCircle2,
  Send,
  Globe,
  Mail,
  Instagram
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface SettingsTabProps {
  lang: 'en' | 'ru';
}

const ProjectContactsCard: React.FC<{
  activeProject: MockProject;
  updateProject: (id: string, updates: Partial<MockProject>) => void;
  lang: 'en' | 'ru';
}> = ({ activeProject, updateProject, lang }) => {
  const toast = useToast();
  const [localContacts, setLocalContacts] = useState<ProjectContacts>(() => {
    return activeProject.contacts || getDefaultContacts(activeProject.name);
  });

  useEffect(() => {
    if (activeProject.contacts) {
      setLocalContacts(activeProject.contacts);
    } else {
      setLocalContacts(getDefaultContacts(activeProject.name));
    }
  }, [activeProject.id, activeProject.contacts]);

  const handleSaveAll = () => {
    updateProject(activeProject.id, { contacts: localContacts });
    toast.success(lang === 'en' ? 'Project contacts saved successfully!' : 'Контакты проекта успешно сохранены!');
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
    <div className="border border-zinc-200 rounded-2xl bg-white p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-950">
              {lang === 'en' ? 'Contacts & Social Networks' : 'Контакты и Социальные сети'}
            </h3>
            <p className="text-xs text-zinc-500">
              {lang === 'en' 
                ? `Unified contact settings for project "${activeProject.name}"`
                : `Единый центр контактов для проекта «${activeProject.name}»`}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSaveAll}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:shadow-indigo-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer self-start sm:self-center shrink-0"
        >
          <CheckCircle2 className="w-4 h-4" />
          {lang === 'en' ? 'SAVE CONTACTS' : 'СОХРАНИТЬ КОНТАКТЫ'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Name & Address */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-zinc-400" />
              {lang === 'en' ? 'Contact Name (vCard)' : 'Имя контакта (vCard)'}
            </label>
            <input 
              type="text"
              value={localContacts.contactName}
              onChange={e => handleContactNameChange(e.target.value)}
              placeholder={lang === 'en' ? 'e.g. Alexey Ivanov' : 'Например: Алексей Иванов'}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              {lang === 'en' ? 'Physical Address (Geo Pin)' : 'Физический адрес (Геометка)'}
            </label>
            <textarea 
              rows={2}
              value={localContacts.address}
              onChange={e => handleAddressChange(e.target.value)}
              placeholder={lang === 'en' ? 'e.g. Moscow, Tverskaya St. 12' : 'Например: Москва, ул. Тверская, 12'}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium resize-none"
            />
            <p className="text-[10px] text-zinc-400 mt-1">
              {lang === 'en' 
                ? 'Adds an interactive Google Map pin to the Socials block automatically when non-empty.'
                : 'Автоматически добавляет интерактивную геометку с картой в блок контактов при заполнении.'}
            </p>

            {/* Map Links (Yandex, 2GIS, etc.) */}
            <div className="space-y-2 mt-4 pl-3 border-l-2 border-zinc-300">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-zinc-700 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-zinc-400" />
                  {lang === 'en' ? 'Map / Location Links (Yandex, 2GIS)' : 'Ссылки на карты (Яндекс, 2ГИС и др.)'}
                </label>
                <button
                  type="button"
                  onClick={handleAddMapLink}
                  className="text-[10px] font-bold text-indigo-600 hover:text-indigo-500 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {lang === 'en' ? 'Add Link' : 'Добавить ссылку'}
                </button>
              </div>
              
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {(localContacts.mapLinks || []).map((link, idx) => (
                  <div key={idx} className="bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl flex flex-col gap-2 relative">
                    <div className="flex items-center gap-2">
                      <input 
                        type="text"
                        value={link.label}
                        onChange={e => handleMapLinkChange(idx, 'label', e.target.value)}
                        placeholder={lang === 'en' ? 'Service Name (e.g. Yandex Maps)' : 'Название (например: Яндекс Карты)'}
                        className="flex-1 bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-zinc-850 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveMapLink(idx)}
                        className="p-1.5 text-zinc-400 hover:text-rose-600 transition-colors"
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
                      className="w-full bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-zinc-850 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                ))}
                {(localContacts.mapLinks || []).length === 0 && (
                  <p className="text-[10px] text-zinc-400 italic">
                    {lang === 'en' ? 'No custom map links added.' : 'Нет дополнительных ссылок на карты.'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Phone List & Departments */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-zinc-700 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-zinc-400" />
              {lang === 'en' ? 'Phone Numbers & Departments' : 'Телефоны и отделы'}
            </label>
            <button
              type="button"
              onClick={handleAddDepartment}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors cursor-pointer bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200"
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
                <div key={dIdx} className="bg-zinc-50 border border-zinc-200 rounded-2xl p-3.5 space-y-3 shadow-xs">
                  {/* Department Header */}
                  <div className="flex items-center gap-2 pb-2 border-b border-zinc-200/80">
                    <button
                      type="button"
                      onClick={() => handleSetPrimaryDept(dept.label)}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
                        dept.isMain 
                          ? 'bg-indigo-600 text-white shadow-xs' 
                          : 'bg-zinc-200 text-zinc-600 hover:bg-zinc-300'
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
                      className="flex-1 bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-zinc-800 focus:outline-none focus:border-indigo-500"
                    />

                    {depts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveDept(dept.label)}
                        className="p-1.5 text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer shrink-0"
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
                        <label className="flex items-center gap-1 text-[11px] text-zinc-600 cursor-pointer select-none shrink-0" title={lang === 'en' ? 'Show in final view' : 'Показывать в финале'}>
                          <input
                            type="checkbox"
                            checked={item.isVisible !== false}
                            onChange={e => handlePhoneVisibilityChange(item.idx, e.target.checked)}
                            className="w-4 h-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-[10px]">{lang === 'en' ? 'Show' : 'Показ.'}</span>
                        </label>

                        <input 
                          type="text"
                          value={item.number}
                          onChange={e => handlePhoneChange(item.idx, e.target.value)}
                          placeholder="+7 (999) 000-00-00"
                          className="flex-1 bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-zinc-800 font-mono focus:outline-none focus:border-indigo-500"
                        />

                        <button
                          type="button"
                          onClick={() => handleAddPhoneToDept(dept.label)}
                          className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors cursor-pointer shrink-0 flex items-center justify-center"
                          title={lang === 'en' ? 'Add another number to this department' : 'Добавить номер в этот отдел'}
                        >
                          <Plus className="w-4 h-4" />
                        </button>

                        {dept.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemovePhoneItem(item.idx)}
                            className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors cursor-pointer shrink-0 flex items-center justify-center"
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
      <div className="pt-4 border-t border-zinc-100 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-zinc-700 flex items-center gap-1.5">
            <Send className="w-3.5 h-3.5 text-zinc-400" />
            {lang === 'en' ? 'Messengers & Social Networks' : 'Мессенджеры и социальные сети'}
          </label>

          {remainingTypes.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-zinc-400">{lang === 'en' ? 'Add:' : 'Добавить:'}</span>
              {remainingTypes.map(t => (
                <button
                  key={t.type}
                  type="button"
                  onClick={() => handleAddSocial(t.type)}
                  className="px-2 py-1 bg-zinc-100 hover:bg-indigo-50 hover:text-indigo-600 text-zinc-600 text-[10px] font-bold rounded-lg border border-zinc-200 transition-all cursor-pointer"
                >
                  + {t.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {localContacts.socials.map((soc, idx) => {
            const isTg = soc.type === 'telegram';
            const isWa = soc.type === 'whatsapp';
            const label = isTg ? 'Telegram' : isWa ? 'WhatsApp' : soc.type.toUpperCase();

            return (
              <div key={idx} className="flex flex-col gap-2 bg-zinc-50 border border-zinc-200 rounded-xl p-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-zinc-700 capitalize shrink-0">
                    {label}
                  </span>
                  <input
                    type="text"
                    value={soc.label || ''}
                    onChange={e => handleSocialLabelChange(idx, e.target.value)}
                    placeholder={lang === 'en' ? 'Label (e.g. Support)' : 'Подпись (например: Поддержка)'}
                    className="flex-1 bg-white border border-zinc-200 rounded-md px-2 py-1 text-[11px] text-zinc-700 focus:outline-none focus:border-indigo-500"
                  />
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleAddSocial(soc.type)}
                      className="p-1 text-zinc-400 hover:text-indigo-600 transition-colors cursor-pointer shrink-0"
                      title={lang === 'en' ? 'Add another' : 'Добавить ещё'}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveSocial(idx)}
                      className="p-1 text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer shrink-0"
                      title={lang === 'en' ? 'Remove' : 'Удалить'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <input 
                  type="text"
                  value={soc.url}
                  onChange={e => handleSocialUrlChange(idx, e.target.value)}
                  placeholder={
                    isTg ? 'https://t.me/username' : 
                    isWa ? 'https://wa.me/79990000000' : 
                    'https://...'
                  }
                  className="w-full bg-white border border-zinc-200 rounded-lg px-2.5 py-1 text-xs text-zinc-800 font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-4 border-t border-zinc-100 flex justify-end">
        <button
          type="button"
          onClick={handleSaveAll}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:shadow-indigo-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4" />
          {lang === 'en' ? 'SAVE CONTACTS' : 'СОХРАНИТЬ КОНТАКТЫ'}
        </button>
      </div>
    </div>
  );
};

export const SettingsTab: React.FC<SettingsTabProps> = ({ lang }) => {
  const { isAuthenticated, activeProjectId, projects, updateProject } = useDev();
  const toast = useToast();

  const activeProject = projects.find(p => p.id === activeProjectId);

  return (
    <div className="flex-1 w-full p-4 sm:p-6 md:p-8 max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Project Contacts Management Card */}
      {activeProject ? (
        <ProjectContactsCard 
          activeProject={activeProject} 
          updateProject={updateProject} 
          lang={lang} 
        />
      ) : (
        <div className="border border-dashed border-zinc-300 rounded-2xl bg-zinc-50/50 p-8 text-center text-zinc-500 text-sm font-medium">
          {lang === 'en' ? 'Select an active project to configure contacts.' : 'Выберите активный проект для настройки контактов.'}
        </div>
      )}

      {/* Platform & Account Settings */}
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
