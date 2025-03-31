
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

export function groupCategoriesByParent(categories: string[]): { [key: string]: string[] } {
  const grouped: { [key: string]: string[] } = {};

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

  return grouped;
}

export function formatCategoryName(categoryCode: string, categoryMap: CategoryMap): string {
  // For codes like "cs.AI", first try the full code
  if (categoryMap[categoryCode.toLowerCase()]) {
    return categoryMap[categoryCode.toLowerCase()];
  }

  // If full code isn't found, try with just the subdomain (after the dot)
  const parts = categoryCode.split('.');
  if (parts.length === 2) {
    const parent = categoryMap[parts[0].toLowerCase()] || parts[0];
    const subcategory = categoryMap[categoryCode.toLowerCase()] || parts[1];
    return `${parent}: ${subcategory}`;
  }

  // Return the original code if no match found
  return categoryCode;
}
