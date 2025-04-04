
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Paper } from '@/lib/supabase';

export type FeedMode = 'newest' | 'mindblown' | 'surprise';

interface FeedModeState {
  currentMode: FeedMode;
  setMode: (mode: FeedMode) => void;
}

// Create the store
export const useFeedModeStore = create<FeedModeState>()(
  persist(
    (set) => ({
      currentMode: 'newest', // Default mode
      setMode: (mode: FeedMode) => set({ currentMode: mode }),
    }),
    {
      name: 'feed-mode-storage', // Unique name for localStorage
    }
  )
);

// Sorting functions based on feed mode
export const sortPapers = (papers: Paper[], mode: FeedMode): Paper[] => {
  const papersCopy = [...papers];
  
  switch (mode) {
    case 'newest':
      // Sort by created_at, newest first
      return papersCopy.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
    case 'mindblown':
      // In a real implementation, this would sort by mind blow count
      // For now, we'll randomize with a seed based on the paper's DOI to simulate
      return papersCopy.sort((a, b) => {
        const scoreA = a.score && typeof a.score === 'number' ? a.score : 0;
        const scoreB = b.score && typeof b.score === 'number' ? b.score : 0;
        return scoreB - scoreA;
      });
      
    case 'surprise':
      // Completely random order
      return papersCopy.sort(() => Math.random() - 0.5);
      
    default:
      return papersCopy;
  }
};
