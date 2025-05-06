
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
    color: '#FDD835',  // Bright yellow
    label: 'BREAKTHROUGH'
  },
  'what if': {
    icon: HelpCircle,
    emoji: '🔮',
    color: '#7E57C2',  // Soft violet
    label: 'WHAT IF'
  },
  'mythbuster': {
    icon: Bomb,
    emoji: '💥',
    color: '#EF5350',  // Strong red
    label: 'MYTHBUSTER'
  },
  'gamechanger': {
    icon: RefreshCw,
    emoji: '✨',
    color: '#F34564',  // Turquoise green
    label: 'GAMECHANGER'
  },
  'reality check': {
    icon: Hourglass,
    emoji: '😳',
    color: '#B0BEC5',  // Cool grey
    label: 'REALITY CHECK'
  },
  'hidden gem': {
    icon: Diamond,
    emoji: '💎',
    color: '#f0f0f0',  // Rich violet
    label: 'HIDDEN GEM'
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
  const label = config.label;

  const sizeClasses = {
    sm: 'text-xs py-0.5 px-1.5',
    md: 'text-xs py-1 px-2',
    lg: 'text-sm py-1.5 px-2.5'
  };

  // Add more prominent shadow and transform effect
  return (
    <Badge 
      variant="outline" 
      className={`
        brutalist-text uppercase font-bold
        flex items-center gap-1.5 
        transform transition-all duration-200 backdrop-blur-sm
        ${sizeClasses[size]}
        ${className}
      `}
      style={{ borderColor: bgColor, backgroundColor: `${bgColor}80` }}
    >
      <span className="mr-0.5">{emoji}</span>
      <span style={{ color: bgColor }}>{label}</span>
    </Badge>
  );
};

export default PostTypeBadge;
