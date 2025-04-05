
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MindBlowState {
  totalCount: number;
  lastPromptedAt: number | null;
  hasSeenDonationPrompt: boolean;
  increment: () => void;
  shouldShowDonationPrompt: () => boolean;
  markDonationPromptSeen: () => void;
  resetPromptTimestamp: () => void;
}

export const useMindBlowTracker = create<MindBlowState>()(
  persist(
    (set, get) => ({
      totalCount: 0,
      lastPromptedAt: null,
      hasSeenDonationPrompt: false,
      
      increment: () => set((state) => ({ 
        totalCount: state.totalCount + 1 
      })),
      
      shouldShowDonationPrompt: () => {
        const state = get();
        
        // Don't show if user has seen it recently
        if (state.lastPromptedAt) {
          const threeDaysAgo = Date.now() - (3 * 24 * 60 * 60 * 1000);
          if (state.lastPromptedAt > threeDaysAgo) return false;
        }
        
        // First threshold at 5 mind blows
        if (state.totalCount >= 5 && !state.hasSeenDonationPrompt) return true;
        
        // Second threshold at 10 mind blows
        if (state.totalCount >= 10 && !state.hasSeenDonationPrompt) return true;
        
        // After 10, only show every 10 mind blows
        if (state.totalCount > 10 && state.totalCount % 10 === 0) {
          return true;
        }
        
        return false;
      },
      
      markDonationPromptSeen: () => set({
        hasSeenDonationPrompt: true,
        lastPromptedAt: Date.now(),
      }),
      
      resetPromptTimestamp: () => set({
        lastPromptedAt: Date.now(),
      }),
    }),
    {
      name: 'mind-blow-tracker',
    }
  )
);
