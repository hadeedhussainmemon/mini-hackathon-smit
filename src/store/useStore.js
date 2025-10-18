import { create } from 'zustand'

export const useStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  currentIdea: null,
  setCurrentIdea: (idea) => set({ currentIdea: idea }),
  currentPitch: null,
  setCurrentPitch: (pitch) => set({ currentPitch: pitch }),
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
}))
