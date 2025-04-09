
import React from 'react';
import { Database } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useDatabaseToggle } from '@/hooks/use-database-toggle';
import { toast } from 'sonner';

const DatabaseToggle = () => {
  const { databaseSource, toggleDatabase } = useDatabaseToggle();
  
  const handleToggle = (checked: boolean) => {
    const newSource = checked ? 'core_paper' : 'n8n_table';
    toggleDatabase(newSource);
    
    const displayName = newSource === 'core_paper' ? 'Core Papers' : 'N8N Papers';
    toast.success(`Switched to ${displayName} database`);
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <div className="flex items-center gap-2">
        <Database className="h-5 w-5 text-gray-600" />
        <div>
          <Label className="text-sm font-medium">Database Source</Label>
          <p className="text-xs text-gray-500">
            {databaseSource === 'n8n_table' ? 'Using N8N Papers' : 'Using Core Papers'}
          </p>
        </div>
      </div>
      
      <Switch 
        checked={databaseSource === 'core_paper'}
        onCheckedChange={handleToggle}
      />
    </div>
  );
};

export default DatabaseToggle;
