import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types/user';
import { UserProgress } from '@/types/workout';

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  progress: UserProgress;
  setUser: (user: User) => void;
  updateUserProfile: (updates: Partial<User>) => void;
  updateProgress: (progress: Partial<UserProgress>) => void;
  logout: () => void;
}

// Default progress values
const defaultProgress: UserProgress = {
  muscleGroups: {
    chest: 0,
    back: 0,
    legs: 0,
    arms: 0,
    core: 0
  },
  personalBests: {},
  strengthRanks: {}
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,
      progress: defaultProgress,
      
      setUser: (user) => set({ user }),
      
      updateUserProfile: (updates) => 
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null
        })),
      
      updateProgress: (progressUpdates) => 
        set((state) => ({
          progress: {
            ...state.progress,
            muscleGroups: {
              ...state.progress.muscleGroups,
              ...(progressUpdates.muscleGroups || {})
            },
            personalBests: {
              ...state.progress.personalBests,
              ...(progressUpdates.personalBests || {})
            },
            strengthRanks: {
              ...state.progress.strengthRanks,
              ...(progressUpdates.strengthRanks || {})
            }
          }
        })),
      
      logout: () => set({ user: null, progress: defaultProgress }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);