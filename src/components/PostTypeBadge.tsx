
import React from 'react';
import { 
  Rocket, 
  HelpCircle, 
  Bomb, 
  RefreshCw, 
  Hourglass, 
  Diamond 
} from 'lucide-react';
import { Badge } from './ui/badge';

export type PostType = 'breakthrough' | 'what if' | 'mythbuster' | 'gamechanger' | 'reality check' | 'hidden gem';

interface PostTypeBadgeProps {
  type: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const PostTypeBadge: React.FC<PostTypeBadgeProps> = ({ 
  type, 
  className = '',
  size = 'md'
}) => {
  const getIcon = () => {
    switch (type?.toLowerCase()) {
      case 'breakthrough':
        return <Rocket size={size === 'sm' ? 14 : 16} />;
      case 'what if':
        return <HelpCircle size={size === 'sm' ? 14 : 16} />;
      case 'mythbuster':
        return <Bomb size={size === 'sm' ? 14 : 16} />;
      case 'gamechanger':
        return <RefreshCw size={size === 'sm' ? 14 : 16} />;
      case 'reality check':
        return <Hourglass size={size === 'sm' ? 14 : 16} />;
      case 'hidden gem':
        return <Diamond size={size === 'sm' ? 14 : 16} />;
      default:
        return null;
    }
  };

  const getLabel = () => {
    if (!type) return '';
    return type.toUpperCase();
  };

  // If no valid type is provided, don't render anything
  if (!type) return null;

  const icon = getIcon();
  if (!icon) return null;

  const sizeClasses = {
    sm: 'text-xs py-0.5 px-1.5',
    md: 'text-xs py-1 px-2',
    lg: 'text-sm py-1.5 px-2.5'
  };

  return (
    <Badge 
      variant="outline" 
      className={`
        brutalist-text uppercase font-bold
        bg-black text-white border-2 border-white
        flex items-center gap-1.5 
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {icon}
      <span>{getLabel()}</span>
    </Badge>
  );
};

export default PostTypeBadge;
