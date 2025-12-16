import React from 'react';
import StatCard from '../components/StatCard';
import SalesChart from '../components/SalesChart';
import TopProducts from '../components/TopProducts';
import { FiDollarSign, FiShoppingCart, FiUsers, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const AdminPage = () => {
  const stats = [
    { title: 'Total Revenue', value: 'Rs. 7,845', icon: <FiDollarSign className="text-green-500" />, trend: { direction: 'up', value: '5.4%' } },
    { title: 'Total Orders', value: '1,234', icon: <FiShoppingCart className="text-blue-500" />, trend: { direction: 'up', value: '2.1%' } },
    { title: 'Total Customers', value: '345', icon: <FiUsers className="text-yellow-500" />, trend: { direction: 'down', value: '1.2%' } },
  ] as const;

  const recentOrders = [
    { id: 'ORD001', customer: 'John Doe', total: 'Rs. 150.00', status: 'Completed' },
    { id: 'ORD002', customer: 'Jane Smith', total: 'Rs. 75.50', status: 'Pending' },
    { id: 'ORD003', customer: 'Mike Johnson', total: 'Rs. 220.00', status: 'Completed' },
    { id: 'ORD004', customer: 'Emily Brown', total: 'Rs. 45.00', status: 'Cancelled' },
    { id: 'ORD005', customer: 'Chris Lee', total: 'Rs. 80.00', status: 'Pending' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500">Here's a snapshot of your store's performance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.title} title={stat.title} value={stat.value} icon={React.cloneElement(stat.icon, { size: 24 })} trend={stat.trend} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <SalesChart />
        </div>
        <div className="lg:col-span-2">
          <TopProducts />
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-2 px-3 font-semibold text-sm text-gray-600">Order ID</th>
                <th className="text-left py-2 px-3 font-semibold text-sm text-gray-600">Customer</th>
                <th className="text-left py-2 px-3 font-semibold text-sm text-gray-600">Total</th>
                <th className="text-left py-2 px-3 font-semibold text-sm text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-3 text-sm text-gray-700">{order.id}</td>
                  <td className="py-3 px-3 text-sm text-gray-700">{order.customer}</td>
                  <td className="py-3 px-3 text-sm text-gray-700">{order.total}</td>
                  <td className="py-3 px-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;