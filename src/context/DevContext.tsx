import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { useToast } from './ToastContext';

export type PlanType = 'basic' | 'premium';
export type TabType = 'landing' | 'projects' | 'editor' | 'dashboard' | 'preview' | 'settings';

export interface MockProject {
  id: string;
  name: string;
  type: 'personal_card' | 'menu' | 'catalog';
  plan: 'basic' | 'premium';
  createdAt: string;
  avatar?: string;
  description?: string;
  layout: 'classic' | 'compact' | 'cover';
  themeStyle: string;
}

export interface DevContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  planType: PlanType;
  setPlanType: (plan: PlanType) => void;
  projects: MockProject[];
  activeProjectId: string | null;
  createProject: (
    name: string,
    type: MockProject['type'],
    plan: MockProject['plan'],
    avatar?: string,
    description?: string,
    layout?: MockProject['layout'],
    themeStyle?: string
  ) => void;
  deleteProject: (id: string) => void;
  setActiveProjectId: (id: string | null) => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isSaving: boolean;
  developerMode: boolean;
  setDeveloperMode: (mode: boolean) => void;
}

const DevContext = createContext<DevContextType | undefined>(undefined);

const getSaved = <T,>(key: string, fallback: T): T => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch (e) {
    console.error("Failed to parse " + key + " from localStorage", e);
    return fallback;
  }
};

export const DevProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const toast = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => getSaved<boolean>('slm_auth_status', false));
  const [planType, setPlanTypeState] = useState<PlanType>(() => getSaved<PlanType>('slm_plan_type', 'premium'));
  const [activeTab, setActiveTab] = useState<TabType>(() => getSaved<TabType>('slm_active_tab', 'landing'));
  const [activeProjectId, setActiveProjectIdState] = useState<string | null>(() => getSaved<string | null>('slm_active_project_id', null));
  const [isSaving, setIsSaving] = useState(false);
  const [developerMode, setDeveloperMode] = useState<boolean>(() => getSaved<boolean>('slm_developer_mode', false));

  const [projects, setProjects] = useState<MockProject[]>(() => getSaved<MockProject[]>('slm_projects', [
    {
      id: 'demo-card',
      name: 'Моя Визитка',
      type: 'personal_card',
      plan: 'basic',
      createdAt: new Date().toLocaleDateString('ru-RU'),
      layout: 'classic',
      themeStyle: 'cosmic',
      description: 'Личная интерактивная визитка'
    },
    {
      id: 'demo-menu',
      name: 'Меню Ресторана',
      type: 'menu',
      plan: 'premium',
      createdAt: new Date().toLocaleDateString('ru-RU'),
      layout: 'compact',
      themeStyle: 'sunset',
      description: 'Официальное меню нашего ресторана'
    }
  ]));

  const firstRender = useRef(true);

  useEffect(() => {
    try {
      localStorage.setItem('slm_plan_type', JSON.stringify(planType));
      localStorage.setItem('slm_active_tab', JSON.stringify(activeTab));
      localStorage.setItem('slm_active_project_id', JSON.stringify(activeProjectId));
      localStorage.setItem('slm_projects', JSON.stringify(projects));
      localStorage.setItem('slm_developer_mode', JSON.stringify(developerMode));
      localStorage.setItem('slm_auth_status', JSON.stringify(isAuthenticated));

      if (firstRender.current) {
        firstRender.current = false;
      } else {
        setIsSaving(true);
        const timer = setTimeout(() => setIsSaving(false), 1200);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.error("Failed to write state to localStorage", e);
    }
  }, [planType, activeTab, activeProjectId, projects, developerMode, isAuthenticated]);

  const login = () => {
    setIsAuthenticated(true);
    setActiveTab('projects');
    localStorage.setItem('slm_auth_status', 'true');
    localStorage.setItem('slm_active_tab', JSON.stringify('projects'));
    toast.success('Добро пожаловать!');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setActiveProjectIdState(null);
    setActiveTab('landing');
    localStorage.setItem('slm_auth_status', 'false');
    localStorage.setItem('slm_active_project_id', JSON.stringify(null));
    localStorage.setItem('slm_active_tab', JSON.stringify('landing'));
  };

  const setPlanType = (newPlan: PlanType) => {
    setPlanTypeState(newPlan);
    if (activeProjectId) {
      setProjects(prev =>
        prev.map(p => (p.id === activeProjectId ? { ...p, plan: newPlan } : p))
      );
    }
  };

  const setActiveProjectId = (id: string | null) => {
    setActiveProjectIdState(id);
    if (id) {
      const proj = projects.find(p => p.id === id);
      if (proj) {
        setPlanTypeState(proj.plan);
      }
    }
  };

  const createProject = (
    name: string,
    type: MockProject['type'],
    plan: MockProject['plan'],
    avatar?: string,
    description?: string,
    layout: MockProject['layout'] = 'classic',
    themeStyle: string = 'cosmic'
  ) => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newProject: MockProject = {
      id: newId,
      name,
      type,
      plan,
      avatar,
      description,
      layout,
      themeStyle,
      createdAt: new Date().toLocaleDateString('ru-RU')
    };
    setProjects(prev => [...prev, newProject]);
    setActiveProjectId(newId);
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    if (activeProjectId === id) {
      setActiveProjectIdState(null);
    }
  };

  return (
    <DevContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        planType,
        setPlanType,
        projects,
        activeProjectId,
        createProject,
        deleteProject,
        setActiveProjectId,
        activeTab,
        setActiveTab,
        isSaving,
        developerMode,
        setDeveloperMode
      }}
    >
      {children}
    </DevContext.Provider>
  );
};

export const useDev = (): DevContextType => {
  const context = useContext(DevContext);
  if (!context) {
    throw new Error('useDev must be used within a DevProvider');
  }
  return context;
};
