
import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className }) => {
  return (
    <div className={`bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-200 mb-4">{title}</h3>
      <div>{children}</div>
    </div>
  );
};

export default Card;
