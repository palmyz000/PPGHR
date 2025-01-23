// components/ui/progress.js
import React from 'react';

export const Progress = ({ value = 0, className = '' }) => {
  return (
    <div className={`w-full bg-gray-200 rounded-full ${className}`}>
      <div
        className="bg-blue-600 rounded-full transition-all"
        style={{ width: `${value}%` }}
      >
        <div className="h-full" />
      </div>
    </div>
  );
};