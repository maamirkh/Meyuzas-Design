'use client';
import React from 'react';

const salesData = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 4500 },
  { name: 'May', sales: 6000 },
  { name: 'Jun', sales: 5500 },
];

const SalesChart = () => {
  const maxValue = Math.max(...salesData.map(d => d.sales));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Sales Trend</h2>
      <div className="flex justify-between items-end h-64">
        {salesData.map((data, index) => (
          <div key={index} className="flex flex-col items-center w-1/6">
            <div
              className="w-10 bg-gradient-to-r from-orange-500 to-pink-600 rounded-t-md"
              style={{ height: `${(data.sales / maxValue) * 100}%` }}
            ></div>
            <span className="text-sm text-gray-500 mt-2">{data.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesChart;