
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type DatabaseSource = 'n8n_table' | 'core_paper' | 'europe_paper';

interface DatabaseToggleState {
  databaseSource: DatabaseSource;
  toggleDatabase: (source?: DatabaseSource) => void;
}

export const useDatabaseToggle = create<DatabaseToggleState>()(
  persist(
    (set) => ({
      databaseSource: 'europe_paper', // Changed default to europe_paper
      toggleDatabase: (source) => set((state) => ({ 
        databaseSource: source || (
          state.databaseSource === 'europe_paper' 
            ? 'n8n_table' 
            : state.databaseSource === 'n8n_table'
              ? 'core_paper'
              : 'europe_paper'
        ) 
      })),
    }),
    {
      name: 'database-source-preference',
    }
  )
);

// Helper function to get the ID field name based on database source
export const getIdFieldName = (databaseSource: DatabaseSource): string => {
  return databaseSource === 'europe_paper' ? 'id' : 'id'; // Both tables now use 'id' as the identifier
};

// Helper function to get the unique ID value from a paper based on database source
export const getPaperId = (paper: any, databaseSource: DatabaseSource): string => {
  if (databaseSource === 'europe_paper' && paper.doi) {
    return paper.doi; // Use DOI as the primary identifier if available
  }
  return paper.id.toString();
};
