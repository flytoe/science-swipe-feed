
import { supabase } from '../integrations/supabase/client';

type CategoryMap = {
  [key: string]: string;
};

let categoryMapCache: CategoryMap | null = null;

export async function fetchCategoryMap(): Promise<CategoryMap> {
  // Return cached version if available
  if (categoryMapCache) {
    return categoryMapCache;
  }

  try {
    const { data, error } = await supabase
      .from('arxiv_taxonomy')
      .select('category_code, category_name');

    if (error) {
      console.error('Error fetching category map:', error);
      return {};
    }

    const categoryMap: CategoryMap = {};
    data.forEach((item) => {
      categoryMap[item.category_code.toLowerCase()] = item.category_name;
    });

    // Cache the map
    categoryMapCache = categoryMap;
    return categoryMap;
  } catch (error) {
    console.error('Error in fetchCategoryMap:', error);
    return {};
  }
}

// Updated to always use category names in grouping
export function groupCategoriesByParent(categories: string[]): { [key: string]: string[] } {
  const grouped: { [key: string]: string[] } = {};
  const getCategoryMap = async () => await fetchCategoryMap();
  
  // Initialize with empty object to avoid async issues
  let categoryMap: CategoryMap = {};
  
  // Use a synchronous approach with cached data if available
  if (categoryMapCache) {
    categoryMap = categoryMapCache;
    processCategoriesWithMap();
  } else {
    // If no cache, we'll just group by code for now
    // The display components will handle translation later
    processCategories();
  }
  
  function processCategoriesWithMap() {
    categories.forEach(category => {
      const parts = category.split('.');
      const parentCode = parts[0];
      const fullCategory = parts.length > 1 ? category : parentCode;
      
      // Use category name if available, otherwise use code
      const parentName = categoryMap[parentCode.toLowerCase()] || parentCode;
      
      if (!grouped[parentName]) {
        grouped[parentName] = [];
      }

      if (!grouped[parentName].includes(fullCategory)) {
        grouped[parentName].push(fullCategory);
      }
    });
  }
  
  function processCategories() {
    categories.forEach(category => {
      const parts = category.split('.');
      const parent = parts[0];
      const fullCategory = parts.length > 1 ? category : parent;

      if (!grouped[parent]) {
        grouped[parent] = [];
      }

      if (!grouped[parent].includes(fullCategory)) {
        grouped[parent].push(fullCategory);
      }
    });
  }
  
  return grouped;
}

// Enhanced formatCategoryName to ensure we always get a proper name
export function formatCategoryName(categoryCode: string, categoryMap: CategoryMap): string {
  // Handle empty input
  if (!categoryCode) return 'Unknown Category';
  
  const lowerCaseCode = categoryCode.toLowerCase();
  
  // For codes like "cs.AI", first try the full code
  if (categoryMap[lowerCaseCode]) {
    return categoryMap[lowerCaseCode];
  }

  // If full code isn't found, try with just the parent (before the dot)
  const parts = categoryCode.split('.');
  if (parts.length === 2) {
    const parent = parts[0].toLowerCase();
    const sub = parts[1].toLowerCase();
    
    const parentName = categoryMap[parent] || parts[0];
    const subName = categoryMap[`${parent}.${sub}`] || categoryMap[sub] || parts[1];
    
    return `${parentName}: ${subName}`;
  }

  // If still not found, use the original code but make it more presentable
  return categoryMap[lowerCaseCode] || categoryCode.replace(/([a-z])([A-Z])/g, '$1 $2');
}

// New helper to format category arrays
export async function formatCategoryArray(categories: string[] | null): Promise<string[]> {
  if (!categories || categories.length === 0) {
    return [];
  }
  
  const categoryMap = await fetchCategoryMap();
  return categories.map(category => formatCategoryName(category, categoryMap));
}
