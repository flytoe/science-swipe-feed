
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

// Post type configuration with icons, emojis, and colors
const postTypeConfig = {
  'breakthrough': {
    icon: Rocket,
    emoji: '⚡',
    color: '#FDD835'  // Bright yellow
  },
  'what if': {
    icon: HelpCircle,
    emoji: '🔮',
    color: '#7E57C2'  // Soft violet
  },
  'mythbuster': {
    icon: Bomb,
    emoji: '💥',
    color: '#EF5350'  // Strong red
  },
  'gamechanger': {
    icon: RefreshCw,
    emoji: '✨',
    color: '#26A69A'  // Turquoise green
  },
  'reality check': {
    icon: Hourglass,
    emoji: '😳',
    color: '#B0BEC5'  // Cool grey
  },
  'hidden gem': {
    icon: Diamond,
    emoji: '💎',
    color: '#AB47BC'  // Rich violet
  }
};

const PostTypeBadge: React.FC<PostTypeBadgeProps> = ({ 
  type, 
  className = '',
  size = 'md'
}) => {
  // Get config for this post type
  const config = type && postTypeConfig[type.toLowerCase()];
  
  // If no valid type or config is provided, don't render anything
  if (!type || !config) return null;

  const Icon = config.icon;
  const emoji = config.emoji;
  const bgColor = config.color;

  const getLabel = () => {
    if (!type) return '';
    return type.toUpperCase();
  };

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
        text-white border-2 border-white
        flex items-center gap-1.5 
        ${sizeClasses[size]}
        ${className}
      `}
      style={{ backgroundColor: bgColor }}
    >
      <span className="mr-0.5">{emoji}</span>
      <span>{getLabel()}</span>
    </Badge>
  );
};

export default PostTypeBadge;
