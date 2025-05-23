
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Paper } from '../types/paper';

export type DatabaseSource = 'europe_paper';

interface DatabaseToggleState {
  databaseSource: DatabaseSource;
  toggleDatabase: (source?: DatabaseSource) => void;
}

export const useDatabaseToggle = create<DatabaseToggleState>()(
  persist(
    (set) => ({
      databaseSource: 'europe_paper',
      toggleDatabase: () => set({ databaseSource: 'europe_paper' }),
    }),
    {
      name: 'database-source-preference',
    }
  )
);

// Helper function to get the ID field name based on database source
export const getIdFieldName = (): string => {
  return 'id';
};

// Helper function to get the unique ID value from a paper
export const getPaperId = (paper: Paper): string => {
  // Ensure ID is returned as a string regardless of its original type
  return paper.id.toString();
};
