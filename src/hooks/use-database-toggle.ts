
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type DatabaseSource = 'n8n_table' | 'core_paper';

interface DatabaseToggleState {
  databaseSource: DatabaseSource;
  toggleDatabase: (source?: DatabaseSource) => void;
}

export const useDatabaseToggle = create<DatabaseToggleState>()(
  persist(
    (set) => ({
      databaseSource: 'n8n_table', // Default to n8n_table
      toggleDatabase: (source) => set((state) => ({ 
        databaseSource: source || (state.databaseSource === 'n8n_table' ? 'core_paper' : 'n8n_table') 
      })),
    }),
    {
      name: 'database-source-preference',
    }
  )
);

// Helper function to get the ID field name based on database source
export const getIdFieldName = (databaseSource: DatabaseSource): string => {
  return databaseSource === 'n8n_table' ? 'doi' : 'core_id';
};

// Helper function to get the unique ID value from a paper based on database source
export const getPaperId = (paper: any, databaseSource: DatabaseSource): string => {
  if (databaseSource === 'n8n_table') {
    return paper.doi;
  } else {
    return paper.core_id;
  }
};
