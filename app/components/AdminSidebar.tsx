'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiGrid, FiPackage, FiShoppingCart, FiArrowLeft, FiTag, FiX } from 'react-icons/fi'; // Import FiX

const AdminSidebar = ({ isSidebarOpen, setIsSidebarOpen }: { isSidebarOpen: boolean, setIsSidebarOpen: (isOpen: boolean) => void }) => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', path: '/admin_L5@X', icon: <FiGrid /> },
    { name: 'Products', path: '/admin_L5@X/products', icon: <FiPackage /> },
    { name: 'On Sale Products', path: '/admin_L5@X/onsaleproducts', icon: <FiTag /> },
    { name: 'Orders', path: '/admin_L5@X/orders', icon: <FiShoppingCart /> },
  ];

  return (
    <aside
      className={`fixed md:static top-0 left-0 h-full bg-[#014a43] text-white flex-col z-40
        ${isSidebarOpen ? 'flex w-64' : 'hidden md:flex md:w-64'} 
        transition-transform duration-300 ease-in-out md:translate-x-0`}
    >
      <div className="p-6 flex items-center justify-between border-b border-gray-700">
        <h1 className="text-2xl font-bold">Admin</h1>
        {/* Close button for small screens */}
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden p-1 text-white hover:text-gray-300"
        >
          <FiX size={24} />
        </button>
      </div>
      <nav className="flex-1 px-4 py-8 overflow-y-auto">
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
                onClick={() => setIsSidebarOpen(false)} // Close sidebar on nav item click
              >
                <span className="mr-3">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-700">
        <Link href="/" className="flex items-center p-3 rounded-lg hover:bg-black hover:bg-opacity-20 text-gray-300"
              onClick={() => setIsSidebarOpen(false)} // Close sidebar on nav item click
        >
            <FiArrowLeft className="mr-3" />
            <span className="font-medium">Back to Store</span>
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;