
import { Paper } from '../types/paper';

/**
 * Create a Paper object from raw data, implementing the getter for 'doi'
 */
export function createPaper(rawData: any): Paper {
  // Create the paper object with all standard properties
  const paper = {
    ...rawData,
    // Ensure the doi property is always available
    doi: rawData.doi || rawData.id
  };
  
  return paper;
}

