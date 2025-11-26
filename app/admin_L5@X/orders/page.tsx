'use client';

import React, { useState } from 'react';

const allOrders = [
  {
    id: '#12345',
    customer: 'John Doe',
    date: '2025-11-24',
    total: '$128.98',
    status: 'Completed',
  },
  {
    id: '#12346',
    customer: 'Jane Smith',
    date: '2025-11-24',
    total: '$45.50',
    status: 'Pending',
  },
  {
    id: '#12347',
    customer: 'Mike Johnson',
    date: '2025-11-23',
    total: '$204.00',
    status: 'Completed',
  },
  {
    id: '#12348',
    customer: 'Emily Brown',
    date: '2025-11-22',
    total: '$75.25',
    status: 'Cancelled',
  },
   {
    id: '#12349',
    customer: 'Chris Lee',
    date: '2025-11-25',
    total: '$99.99',
    status: 'Pending',
  },
];

const getStatusClass = (status: string) => {
    switch (status) {
        case 'Completed':
            return 'bg-green-100 text-green-800';
        case 'Pending':
            return 'bg-yellow-100 text-yellow-800';
        case 'Cancelled':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

const OrdersPage = () => {
    const [filter, setFilter] = useState('All');

    const filteredOrders = allOrders.filter(order => filter === 'All' || order.status === filter);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>
      </div>

       <div className="mb-4 flex space-x-2">
        <button onClick={() => setFilter('All')} className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${filter === 'All' ? 'bg-gradient-to-r from-[#9ECFD4] via-[#78B9B5] to-[#016B61] text-black shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>All</button>
        <button onClick={() => setFilter('Pending')} className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${filter === 'Pending' ? 'bg-gradient-to-r from-[#9ECFD4] via-[#78B9B5] to-[#016B61] text-black shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Pending</button>
        <button onClick={() => setFilter('Completed')} className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${filter === 'Completed' ? 'bg-gradient-to-r from-[#9ECFD4] via-[#78B9B5] to-[#016B61] text-black shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Completed</button>
        <button onClick={() => setFilter('Cancelled')} className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${filter === 'Cancelled' ? 'bg-gradient-to-r from-[#9ECFD4] via-[#78B9B5] to-[#016B61] text-black shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Cancelled</button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Total
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{order.id}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{order.customer}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{order.date}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{order.total}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <span
                    className={`relative inline-block px-3 py-1 font-semibold leading-tight rounded-full ${getStatusClass(order.status)}`}
                  >
                    <span className="relative">{order.status}</span>
                  </span>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <button className="px-3 py-1 bg-gradient-to-r from-[#9ECFD4] via-[#78B9B5] to-[#016B61] text-black text-xs font-bold rounded-md hover:from-[#78B9B5] hover:via-[#016B61] hover:to-[#9ECFD4] shadow-sm transition-all duration-300">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersPage;