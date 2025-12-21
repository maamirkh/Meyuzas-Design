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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // State to hold auth status, null initially
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar visibility

  useEffect(() => {
    // This useEffect runs only on the client after initial render
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    setIsAuthenticated(isAdmin);
  }, []); // Empty dependency array means it runs once on mount

  useEffect(() => {
    // Only redirect if authentication status is known and user is not authenticated
    if (isAuthenticated === false) { // Explicitly check for false, not null
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated === null) {
    // Show a loading spinner or null while authentication status is being determined on client
    return null;
  }

  if (isAuthenticated === false) {
    // If not authenticated, the useEffect above will redirect.
    // We return null here to prevent rendering the admin layout temporarily
    // or until the redirect happens.
    return null;
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