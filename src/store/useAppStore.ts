import { create } from 'zustand';
import type { Kid, Parent, Project } from '@/types';

interface AppState {
  kid: Kid | null;
  parent: Parent | null;
  kidSessionToken: string | null;
  activeProject: Project | null;
  setKid: (kid: Kid | null) => void;
  setParent: (parent: Parent | null) => void;
  setKidSessionToken: (token: string | null) => void;
  setActiveProject: (project: Project | null) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  kid: null,
  parent: null,
  kidSessionToken: null,
  activeProject: null,
  setKid: (kid) => set({ kid }),
  setParent: (parent) => set({ parent }),
  setKidSessionToken: (kidSessionToken) => set({ kidSessionToken }),
  setActiveProject: (activeProject) => set({ activeProject }),
  logout: () => set({ kid: null, parent: null, kidSessionToken: null, activeProject: null })
}));
