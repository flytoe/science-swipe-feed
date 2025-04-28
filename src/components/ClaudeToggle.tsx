
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { supabase } from '../integrations/supabase/client';
import { useDatabaseToggle } from '@/hooks/use-database-toggle';

interface ClaudeToggleProps {
  paperId: string | number;
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
}

const ClaudeToggle: React.FC<ClaudeToggleProps> = ({ 
  paperId, 
  isEnabled, 
  onToggle, 
  size = 'sm' 
}) => {
  const { databaseSource } = useDatabaseToggle();
  
  const handleToggle = async (checked: boolean) => {
    // Update UI state immediately (optimistic update)
    onToggle(checked);
    
    // Only attempt database update for europe_paper
    if (databaseSource === 'europe_paper') {
      try {
        const { error } = await supabase
          .from('europe_paper')
          .update({ show_claude: checked })
          .eq('id', paperId);
        
        if (error) {
          console.error('Error updating Claude preference:', error);
          toast.error('Failed to save preference');
          // Revert UI if save fails
          onToggle(!checked);
        }
      } catch (error) {
        console.error('Error in toggle action:', error);
        toast.error('Failed to save preference');
        // Revert UI if save fails
        onToggle(!checked);
      }
    }
  };

  return (
    <div className={`flex items-center gap-2 ${size === 'sm' ? 'scale-90' : ''}`}>
      <Switch 
        id={`claude-toggle-${paperId}`}
        checked={isEnabled}
        onCheckedChange={handleToggle}
      />
      <Label 
        htmlFor={`claude-toggle-${paperId}`} 
        className="text-xs text-gray-500 cursor-pointer"
      >
        {isEnabled ? 'Claude AI' : 'Default AI'}
      </Label>
    </div>
  );
};

export default ClaudeToggle;
