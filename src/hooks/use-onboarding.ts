
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserPreferences {
  userType: string | null;
  interestedTopics: string[];
  completedOnboarding: boolean;
}

interface OnboardingState extends UserPreferences {
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  setUserType: (type: string | null) => void;
  setInterestedTopics: (topics: string[]) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

// Default/initial state
const initialState: UserPreferences = {
  userType: null,
  interestedTopics: [],
  completedOnboarding: false,
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      ...initialState,
      showOnboarding: false,
      
      setShowOnboarding: (show) => set({ showOnboarding: show }),
      
      setUserType: (type) => set({ userType: type }),
      
      setInterestedTopics: (topics) => set({ interestedTopics: topics }),
      
      completeOnboarding: () => set({ 
        completedOnboarding: true,
        showOnboarding: false
      }),
      
      resetOnboarding: () => set({ 
        ...initialState,
        showOnboarding: true
      }),
    }),
    {
      name: 'user-preferences', // unique name for localStorage
    }
  )
);
