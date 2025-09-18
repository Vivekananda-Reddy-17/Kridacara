import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = '', hover = false, onClick }: CardProps) {
  const hoverClass = hover ? 'hover:shadow-xl hover:scale-105 cursor-pointer' : '';
  const clickableClass = onClick ? 'transition-all duration-300' : '';

  return (
    <div 
      className={`bg-white rounded-xl shadow-lg border border-gray-100 ${hoverClass} ${clickableClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}