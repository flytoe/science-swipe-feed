
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
        
        // If they've already seen the prompt, don't show again
        if (state.hasSeenDonationPrompt) return false;
        
        // First threshold at 5 mind blows
        if (state.totalCount === 5) return true;
        
        // Second threshold at 10 mind blows
        if (state.totalCount === 10) return true;
        
        // After 10, only show every 10 mind blows
        if (state.totalCount > 10 && state.totalCount % 10 === 0) {
          // If we've shown within the last 3 days, don't show again
          if (state.lastPromptedAt) {
            const threeDaysAgo = Date.now() - (3 * 24 * 60 * 60 * 1000);
            if (state.lastPromptedAt > threeDaysAgo) return false;
          }
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
