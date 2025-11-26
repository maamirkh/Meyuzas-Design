'use client';
import React from 'react';

const topProducts = [
  { name: 'Product A', sales: 120 },
  { name: 'Product B', sales: 98 },
  { name: 'Product C', sales: 75 },
  { name: 'Product D', sales: 62 },
];

const TopProducts = () => {
    const maxSales = Math.max(...topProducts.map(p => p.sales));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Top Selling Products</h2>
      <ul>
        {topProducts.map((product, index) => (
          <li key={index} className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-700">{product.name}</span>
              <span className="font-bold text-gray-800">{product.sales} sales</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-orange-500 to-pink-600 h-2 rounded-full"
                style={{ width: `${(product.sales / maxSales) * 100}%` }}
              ></div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopProducts;