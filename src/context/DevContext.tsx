import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'guest' | 'authorized';
export type PlanType = 'basic' | 'premium';
export type TabType = 'landing' | 'projects' | 'editor' | 'dashboard' | 'preview';

export interface MockProject {
  id: string;
  name: string;
  type: 'personal_card' | 'menu' | 'catalog';
  plan: 'basic' | 'premium';
  createdAt: string;
}

export interface DevContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  planType: PlanType;
  setPlanType: (plan: PlanType) => void;
  projects: MockProject[];
  activeProjectId: string | null;
  createProject: (name: string, type: MockProject['type'], plan: MockProject['plan']) => void;
  deleteProject: (id: string) => void;
  setActiveProjectId: (id: string | null) => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const DevContext = createContext<DevContextType | undefined>(undefined);

export const DevProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole>('authorized');
  const [planType, setPlanTypeState] = useState<PlanType>('premium');
  const [activeTab, setActiveTab] = useState<TabType>('landing');
  const [activeProjectId, setActiveProjectIdState] = useState<string | null>(null);

  const [projects, setProjects] = useState<MockProject[]>([
    {
      id: 'demo-card',
      name: 'Моя Визитка',
      type: 'personal_card',
      plan: 'basic',
      createdAt: new Date().toLocaleDateString('ru-RU')
    },
    {
      id: 'demo-menu',
      name: 'Меню Ресторана',
      type: 'menu',
      plan: 'premium',
      createdAt: new Date().toLocaleDateString('ru-RU')
    }
  ]);

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

  const createProject = (name: string, type: MockProject['type'], plan: MockProject['plan']) => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newProject: MockProject = {
      id: newId,
      name,
      type,
      plan,
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
        userRole,
        setUserRole,
        planType,
        setPlanType,
        projects,
        activeProjectId,
        createProject,
        deleteProject,
        setActiveProjectId,
        activeTab,
        setActiveTab
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
