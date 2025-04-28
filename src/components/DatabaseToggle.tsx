
import React from 'react';
import { Database } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useDatabaseToggle, DatabaseSource } from '@/hooks/use-database-toggle';
import { toast } from 'sonner';

const DatabaseToggle = () => {
  const { databaseSource, toggleDatabase } = useDatabaseToggle();
  
  const handleToggle = (value: string) => {
    const newSource = value as DatabaseSource;
    toggleDatabase(newSource);
    
    const displayMap = {
      'n8n_table': 'N8N Papers',
      'core_paper': 'Core Papers',
      'europe_paper': 'Europe Papers'
    };
    
    toast.success(`Switched to ${displayMap[newSource]} database`);
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <Database className="h-5 w-5 text-gray-600" />
        <Label className="text-sm font-medium">Database Source</Label>
      </div>
      
      <RadioGroup 
        value={databaseSource} 
        onValueChange={handleToggle}
        className="flex flex-col space-y-1"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="europe_paper" id="europe" />
          <Label htmlFor="europe" className="text-sm font-medium">Europe Papers</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="core_paper" id="core" />
          <Label htmlFor="core" className="text-sm">Core Papers</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="n8n_table" id="n8n" />
          <Label htmlFor="n8n" className="text-sm">N8N Papers</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default DatabaseToggle;
