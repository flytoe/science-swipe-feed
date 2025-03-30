
import React, { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';

interface CategoryFilterProps {
  onFilterChange: (categories: string[]) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ onFilterChange }) => {
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all unique categories from the database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('n8n_table')
          .select('category');
        
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

  useEffect(() => {
    onFilterChange(selectedCategories);
  }, [selectedCategories, onFilterChange]);

  const handleToggleCategory = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const filteredCategories = allCategories.filter(category => 
    category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const clearFilters = () => {
    setSelectedCategories([]);
    setSearchTerm('');
  };

  return (
    <div className="flex flex-col gap-4 p-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Filter by category</h3>
        {selectedCategories.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="h-7 px-2 text-xs"
          >
            Clear <X className="ml-1 h-3 w-3" />
          </Button>
        )}
      </div>
      
      <Input 
        placeholder="Search categories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="h-8 text-sm"
      />
      
      {isLoading ? (
        <p className="text-sm text-gray-400">Loading categories...</p>
      ) : filteredCategories.length === 0 ? (
        <p className="text-sm text-gray-400">No categories found</p>
      ) : (
        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
          {filteredCategories.map((category, index) => (
            <Badge
              key={index}
              variant={selectedCategories.includes(category) ? "default" : "outline"}
              className="cursor-pointer capitalize"
              onClick={() => handleToggleCategory(category)}
            >
              {selectedCategories.includes(category) && (
                <Check className="mr-1 h-3 w-3" />
              )}
              {category}
            </Badge>
          ))}
        </div>
      )}
      
      {selectedCategories.length > 0 && (
        <div className="text-xs text-gray-400">
          {selectedCategories.length} categories selected
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;
