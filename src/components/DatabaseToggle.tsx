
import React from 'react';
import { Database } from 'lucide-react';
import { Label } from '@/components/ui/label';

const DatabaseToggle = () => {
  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <Database className="h-5 w-5 text-gray-600" />
        <Label className="text-sm font-medium">Database Source</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 bg-indigo-500 rounded-full"></div>
        <Label className="text-sm font-medium">Europe Papers</Label>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        The application is currently using only Europe Papers as the data source.
      </div>
    </div>
  );
};

export default DatabaseToggle;
