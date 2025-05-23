
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { supabase } from '../integrations/supabase/client';
import { NativeSwitch } from './ui/native-switch';

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
      const { error } = await supabase
        .from('europe_paper')
        .update({ show_claude: checked })
        .eq('id', Number(paperId)); // Convert to Number to ensure compatibility
      
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
  };

  const sizeClasses = {
    sm: 'scale-90',
    md: 'scale-100',
    lg: 'scale-110'
  };

  return (
    <div className={`flex items-center gap-2 ${sizeClasses[size]} ${className}`}>
      <Switch 
        id={`claude-toggle-${paperId}`}
        checked={isEnabled}
        onCheckedChange={handleToggle}
      />
      <Label 
        htmlFor={`claude-toggle-${paperId}`} 
        className="text-xs font-medium cursor-pointer"
      >
        {isEnabled ? 'Claude AI' : 'Default AI'}
      </Label>
    </div>
  );
};

export default ClaudeToggle;
