import React from 'react';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';

interface StatCardProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
  trend?: {
    direction: 'up' | 'down';
    value: string;
  };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between transition-transform transform hover:scale-105">
      <div className="flex items-center">
        {icon && (
          <div className="p-3 bg-gray-100 rounded-full mr-4">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
      {trend && (
        <div className={`flex items-center text-sm font-medium ${trend.direction === 'up' ? 'text-green-500' : 'text-red-500'}`}>
          {trend.direction === 'up' ? <FiArrowUp /> : <FiArrowDown />}
          <span className="ml-1">{trend.value}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;