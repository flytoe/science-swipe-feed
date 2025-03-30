
import React, { useState, useEffect } from 'react';
import { CheckIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { supabase } from '../integrations/supabase/client';

interface CategoryFilterProps {
  onFilterChange: (selectedCategories: string[]) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ onFilterChange }) => {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('n8n_table')
        .select('category')
        .not('category', 'is', null);

      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }

      // Extract all categories from the data
      const allCategories = data
        .flatMap(item => {
          if (Array.isArray(item.category)) {
            return item.category;
          }
          return item.category ? [item.category] : [];
        })
        .filter(Boolean);

      // Remove duplicates
      const uniqueCategories = [...new Set(allCategories)].sort();
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error processing categories:', error);
    }
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => {
      const isSelected = prev.includes(category);
      const newSelection = isSelected
        ? prev.filter(c => c !== category)
        : [...prev, category];
      
      // Notify parent component of the change
      onFilterChange(newSelection);
      return newSelection;
    });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    onFilterChange([]);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="border-none bg-gray-800/50 backdrop-blur-sm hover:bg-gray-700/60"
        >
          <span className="text-white">
            {selectedCategories.length > 0 
              ? `${selectedCategories.length} selected` 
              : 'Filter by category'}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 bg-gray-900 border border-gray-800 text-white">
        <Command className="bg-transparent">
          <CommandInput placeholder="Search categories..." className="text-white" />
          <CommandList>
            <CommandEmpty>No categories found.</CommandEmpty>
            <CommandGroup>
              {categories.map(category => (
                <CommandItem
                  key={category}
                  onSelect={() => toggleCategory(category)}
                  className="flex items-center cursor-pointer hover:bg-gray-800"
                >
                  <div className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border ${
                    selectedCategories.includes(category) 
                      ? 'border-primary bg-primary text-primary-foreground' 
                      : 'border-gray-500'
                  }`}>
                    {selectedCategories.includes(category) && (
                      <CheckIcon className="h-3 w-3" />
                    )}
                  </div>
                  <span>{category}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          {selectedCategories.length > 0 && (
            <div className="border-t border-gray-800 p-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-white hover:bg-gray-800"
                onClick={clearFilters}
              >
                <X className="mr-2 h-4 w-4" />
                Clear filters
              </Button>
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CategoryFilter;
