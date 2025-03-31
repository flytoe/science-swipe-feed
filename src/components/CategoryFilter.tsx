
import React, { useState, useEffect } from 'react';
import { Check, X, Search, RefreshCw } from 'lucide-react';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';
import { ScrollArea } from './ui/scroll-area';
import { fetchCategoryMap, formatCategoryName } from '../utils/categoryUtils';

interface CategoryFilterProps {
  onFilterChange: (categories: string[]) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ onFilterChange }) => {
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [categoryMap, setCategoryMap] = useState<{[key: string]: string}>({});
  const [groupedCategoriesWithNames, setGroupedCategoriesWithNames] = useState<{[key: string]: {code: string, name: string}[]}>({});

  // Fetch all unique categories from the database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        
        // Fetch category map
        const map = await fetchCategoryMap();
        setCategoryMap(map);
        
        const { data, error } = await supabase
          .from('n8n_table')
          .select('category')
          .eq('ai_summary_done', true); // Only fetch categories from papers with ai_summary_done = true
        
        if (error) {
          console.error('Error fetching categories:', error);
          toast.error('Failed to load categories');
          return;
        }

        // Extract all unique categories
        const categories = new Set<string>();
        
        data?.forEach(item => {
          if (item.category) {
            // Handle both string and array types
            if (Array.isArray(item.category)) {
              item.category.forEach((cat: string | null) => {
                if (typeof cat === 'string') categories.add(cat);
              });
            } else if (typeof item.category === 'string') {
              categories.add(item.category);
            }
          }
        });
        
        const uniqueCategories = Array.from(categories);
        setAllCategories(uniqueCategories);
        
        // Process categories into groups with names
        await processCategoriesWithNames(uniqueCategories, map);
        
        console.log('Fetched categories:', uniqueCategories);
      } catch (error) {
        console.error('Error in fetchCategories:', error);
        toast.error('Failed to load categories');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  // Group categories by parent and provide names
  const processCategoriesWithNames = async (categories: string[], map: {[key: string]: string}) => {
    const grouped: {[key: string]: {code: string, name: string}[]} = {};

    categories.forEach(category => {
      const parts = category.split('.');
      const parentCode = parts[0];
      const fullCode = category;
      
      // Get the parent category name
      const parentName = map[parentCode.toLowerCase()] || parentCode;
      
      // Format the full category name
      const fullName = formatCategoryName(fullCode, map);
      
      if (!grouped[parentName]) {
        grouped[parentName] = [];
      }

      // Add the category with both code and formatted name
      grouped[parentName].push({
        code: fullCode,
        name: fullName
      });
    });

    // Sort the groups alphabetically
    const sortedGroups: {[key: string]: {code: string, name: string}[]} = {};
    Object.keys(grouped).sort().forEach(key => {
      // Sort categories within each group
      sortedGroups[key] = grouped[key].sort((a, b) => a.name.localeCompare(b.name));
    });

    setGroupedCategoriesWithNames(sortedGroups);
  };

  useEffect(() => {
    onFilterChange(selectedCategories);
  }, [selectedCategories, onFilterChange]);

  const handleToggleCategory = (categoryCode: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryCode)) {
        return prev.filter(c => c !== categoryCode);
      } else {
        return [...prev, categoryCode];
      }
    });
  };

  // Filter categories by search term using both code and name
  const filteredGroupedCategories = Object.fromEntries(
    Object.entries(groupedCategoriesWithNames).filter(([parentName, categories]) => {
      // Check if parent name matches
      if (parentName.toLowerCase().includes(searchTerm.toLowerCase())) {
        return true;
      }
      
      // Check if any category in this group matches
      return categories.some(cat => 
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        cat.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }).map(([parentName, categories]) => {
      // Also filter the categories within each group
      const filteredCategories = categories.filter(cat => 
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        cat.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parentName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      return [parentName, filteredCategories];
    })
  );

  const clearFilters = () => {
    setSelectedCategories([]);
    setSearchTerm('');
  };

  return (
    <div className="flex flex-col gap-4 p-2 h-[80vh]">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-md font-medium text-white">Filter by category</h3>
        {selectedCategories.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="h-7 px-2 text-xs text-white hover:bg-white/10"
          >
            Reset <X className="ml-1 h-3 w-3" />
          </Button>
        )}
      </div>
      
      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-white/50" />
        <Input 
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-10 text-sm pl-8 bg-white/10 text-white border-white/20 focus:border-white/30 placeholder:text-white/50"
        />
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <RefreshCw className="h-6 w-6 text-white/50 animate-spin" />
        </div>
      ) : Object.keys(filteredGroupedCategories).length === 0 ? (
        <p className="text-sm text-white/60 text-center py-8">No categories found</p>
      ) : (
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            {Object.entries(filteredGroupedCategories).map(([parentName, categories]) => (
              <div key={parentName} className="space-y-2">
                <h4 className="text-sm font-medium text-white/70 capitalize">
                  {parentName}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category, index) => (
                    <Badge
                      key={index}
                      variant={selectedCategories.includes(category.code) ? "default" : "outline"}
                      className={`cursor-pointer capitalize ${
                        selectedCategories.includes(category.code) 
                          ? "bg-white text-black" 
                          : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                      }`}
                      onClick={() => handleToggleCategory(category.code)}
                    >
                      {selectedCategories.includes(category.code) && (
                        <Check className="mr-1 h-3 w-3" />
                      )}
                      {category.name}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
      
      {selectedCategories.length > 0 && (
        <div className="text-xs text-white/50 py-2 border-t border-white/10 mt-2">
          {selectedCategories.length} categories selected
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;
