
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { supabase } from '../integrations/supabase/client';

interface ClaudeToggleProps {
  paperId: string | number;
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ClaudeToggle: React.FC<ClaudeToggleProps> = ({ 
  paperId, 
  isEnabled, 
  onToggle, 
  size = 'sm',
  className = ''
}) => {
  const handleToggle = async (checked: boolean) => {
    // Update UI state immediately (optimistic update)
    onToggle(checked);
    
    try {
      // Convert paperId to appropriate type for database comparison
      const numericId = typeof paperId === 'string' ? parseInt(paperId, 10) : paperId;
      
      console.log(`Toggling Claude mode for paper ${numericId} to ${checked}`);
      
      const { error } = await supabase
        .from('europe_paper')
        .update({ show_claude: checked })
        .eq('id', numericId);
      
      if (error) {
        console.error('Error updating Claude preference:', error);
        toast.error('Failed to save preference');
        // Revert UI if save fails
        onToggle(!checked);
      } else {
        console.log('Claude preference updated successfully');
      }
    } catch (error) {
      console.error('Error in toggle action:', error);
      toast.error('Failed to save preference');
      // Revert UI if save fails
      onToggle(!checked);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${size === 'sm' ? 'scale-90' : ''} ${className}`}>
      <Switch 
        id={`claude-toggle-${paperId}`}
        checked={isEnabled}
        onCheckedChange={handleToggle}
      />
      <Label 
        htmlFor={`claude-toggle-${paperId}`} 
        className="text-xs text-gray-500 cursor-pointer select-none"
      >
        {isEnabled ? 'Claude AI' : 'Default AI'}
      </Label>
    </div>
  );
};

export default ClaudeToggle;
