// components/ui/button.js
import React from 'react';

export const Button = ({ 
  children, 
  className = '', 
  size = 'md',
  onClick,
  ...props 
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`inline-flex items-center justify-center font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};