'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiGrid, FiPackage, FiShoppingCart, FiArrowLeft } from 'react-icons/fi';

const AdminSidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', path: '/admin_L5@X', icon: <FiGrid /> },
    { name: 'Products', path: '/admin_L5@X/products', icon: <FiPackage /> },
    { name: 'Orders', path: '/admin_L5@X/orders', icon: <FiShoppingCart /> },
  ];

  return (
    <aside className="w-64 h-screen bg-[#014a43] text-white flex flex-col">
      <div className="p-6 flex items-center justify-center border-b border-gray-700">
        <h1 className="text-2xl font-bold">Admin</h1>
      </div>
      <nav className="flex-1 px-4 py-8">
        <ul>
          {navItems.map((item) => (
            <li key={item.name} className="mb-2">
              <Link
                href={item.path}
                className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                  pathname === item.path
                    ? 'bg-black bg-opacity-20 text-white'
                    : 'text-gray-300 hover:bg-black hover:bg-opacity-20 hover:text-white'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-700">
        <Link href="/" className="flex items-center p-3 rounded-lg hover:bg-black hover:bg-opacity-20 text-gray-300">
            <FiArrowLeft className="mr-3" />
            <span className="font-medium">Back to Store</span>
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;