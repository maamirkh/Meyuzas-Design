'use client';

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '../components/AdminSidebar';
import { FiMenu } from 'react-icons/fi'; // Import the menu icon

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isAuthenticated = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isAdmin') === 'true';
    }
    return false;
  })[0];
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar visibility

  useEffect(() => {
    if (typeof window !== 'undefined' && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Backdrop for small screens when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Toggle button for small screens */}
      <div className="md:hidden absolute top-4 left-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-gray-800 bg-white rounded-md shadow-md"
        >
          <FiMenu size={24} />
        </button>
      </div>

      <AdminSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <main
        className={`flex-1 p-6 overflow-y-auto transition-all duration-300
          ${isSidebarOpen ? 'md:ml-64 ml-0' : 'md:ml-0 ml-0'} // Adjusted margin for main content
        `}
      >
        {children}
      </main>
    </div>
  );
}