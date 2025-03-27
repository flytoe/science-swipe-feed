
import React from 'react';

type CategoryTagProps = {
  category: string;
};

const colors = {
  physics: 'bg-purple-100 text-purple-800',
  biology: 'bg-green-100 text-green-800',
  chemistry: 'bg-yellow-100 text-yellow-800',
  medicine: 'bg-red-100 text-red-800',
  technology: 'bg-blue-100 text-blue-800',
  psychology: 'bg-pink-100 text-pink-800',
  environment: 'bg-teal-100 text-teal-800',
  astronomy: 'bg-indigo-100 text-indigo-800',
  mathematics: 'bg-cyan-100 text-cyan-800',
  neuroscience: 'bg-orange-100 text-orange-800',
  default: 'bg-gray-100 text-gray-800',
};

const CategoryTag: React.FC<CategoryTagProps> = ({ category }) => {
  const categoryKey = category.toLowerCase();
  const colorClass = colors[categoryKey as keyof typeof colors] || colors.default;
  
  return (
    <span className={`category-tag ${colorClass} animate-fade-in`}>
      {category}
    </span>
  );
};

export default CategoryTag;
