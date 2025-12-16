'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { UserButton, SignedIn, SignedOut, useUser, SignInButton, SignUpButton } from '@clerk/nextjs';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartCount } = useCart();
  const { user } = useUser();

  const navItems = [
    { name: 'Home', path: '/', ariaLabel: 'Go to home page' },
    { name: 'Products', path: '/fetchProduct', ariaLabel: 'Browse all products' },
    { name: 'On Sale', path: '/fetchSaleProducts', ariaLabel: 'View on sale items' },
    { name: 'About Us', path: '/about-us', ariaLabel: 'Learn about us' },
    { name: 'Contact Us', path: '/contact-us', ariaLabel: 'Contact us' }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      setIsSearchOpen(false); // Close search bar after search
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#78B9B5] backdrop-blur-md border-b border-gray-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16 lg:h-20">
          
          {/* Left Section: Hamburger and Search Icon (Mobile/Tablet) */}
          <div className="flex items-center lg:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100/50 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-black"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              type="button"
            >
              <svg 
                className={`h-6 w-6 text-[#016B61] transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
             <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-lg hover:bg-gray-100/50 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-black ml-2"
              aria-label="Open search"
              type="button"
            >
              <svg className="h-6 w-6 text-[#016B61]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* Center Section: Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:static lg:left-auto lg:top-auto lg:translate-x-0 lg:translate-y-0">
            <Link 
              href="/" 
              aria-label="Meyuza's Design - Go to homepage"
              className="block"
            >
              <Image 
                src="/logos/logo1.png" 
                alt="Meyuza's Design Logo" 
                width={80}
                height={80}
                priority
                quality={75}
                className="w-20 h-auto lg:w-24 hover:scale-105 transition-transform duration-300"
              />
            </Link>
          </div>

          {/* Desktop Navigation (becomes primary nav) */}
          <nav 
            className="hidden lg:flex flex-1 items-center justify-center space-x-4 xl:space-x-8"
            aria-label="Main navigation"
          >
            {navItems.map((item) => (
              <Link 
                key={item.name}
                href={item.path}
                aria-label={item.ariaLabel}
                className="relative text-[#016B61] hover:text-[#014a43] font-bold text-sm lg:text-base transition-colors duration-200 group py-2 px-1 xl:px-2"
              >
                {item.name}
                <span 
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#014a43] group-hover:w-full transition-all duration-700 ease-in-out" 
                  aria-hidden="true"
                ></span>
              </Link>
            ))}
          </nav>
          
          {/* Right Section: Actions */}
          <div className="flex items-center justify-end space-x-2 sm:space-x-3">
             {/* Desktop Search */}
            <form onSubmit={handleSearch} className="relative group hidden lg:block">
              <label htmlFor="search-desktop" className="sr-only">Search products</label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-transform duration-300 group-hover:scale-110">
                <svg className="h-4 w-4 text-gray-400 transition-colors duration-300 group-hover:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                id="search-desktop"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white w-32 lg:w-48 transition-all duration-300 hover:bg-gray-200 focus:shadow-lg focus:scale-105"
                aria-label="Search input"
              />
            </form>


            {/* Cart Button */}
            <Link
              href="/Cart"
              className="relative p-2 group hover:scale-105 rounded-lg hover:bg-[#014a43] focus:ring-2 focus:ring-[#016B61] focus:ring-opacity-50 transition-all duration-300"
              aria-label={`View shopping cart with ${cartCount} items`}
            >
              <Image 
                src="/cart.png" 
                alt="Shopping cart icon" 
                width={24}
                height={24}
                className="transition-transform duration-300 group-hover:scale-110 h-5 w-5 sm:h-6 sm:w-6"
              />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-600 text-white text-[10px] sm:text-xs font-black rounded-full min-w-[18px] h-4 sm:min-w-[20px] sm:h-5 flex items-center justify-center px-1 sm:px-1.5 shadow-lg border-2 border-white animate-pulse-scale">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* User Actions */}
            <div className="flex items-center">
              <SignedIn>
                <div className="w-8 h-8">
                    <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>
              <SignedOut>
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="relative p-2 group hover:scale-105 rounded-lg hover:bg-[#014a43] focus:ring-2 focus:ring-[#016B61] focus:ring-opacity-50 transition-all duration-300"
                    aria-label="Open user menu"
                    aria-haspopup="true"
                    aria-expanded={isUserMenuOpen}
                  >
                    <Image 
                      src="/user.png" 
                      alt="User account" 
                      width={24}
                      height={24}
                      className="transition-transform duration-300 group-hover:scale-110 h-5 w-5 sm:h-6 sm:w-6"
                    />
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
                      <div onClick={() => setIsUserMenuOpen(false)}>
                        <SignInButton mode="modal" fallbackRedirectUrl="/">
                          <button className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100 transition-colors duration-150">
                              Sign In
                          </button>
                        </SignInButton>
                      </div>
                      <div onClick={() => setIsUserMenuOpen(false)}>
                        <SignUpButton mode="modal" fallbackRedirectUrl="/">
                          <button className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-gray-100 transition-colors duration-150">
                              Sign Up
                          </button>
                        </SignUpButton>
                      </div>
                    </div>
                  )}
                </div>
              </SignedOut>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${isSearchOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
            <form onSubmit={handleSearch} className="relative py-4 group">
              <label htmlFor="search-mobile" className="sr-only">Search products</label>
              <input
                id="search-mobile"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all duration-300 focus:shadow-lg"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                <svg className="h-5 w-5 text-gray-400 transition-colors duration-300 group-focus-within:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>
        </div>
        
        {/* Mobile Menu */}
        <nav 
          className={`lg:hidden bg-white border-t border-gray-200 overflow-hidden transition-all duration-500 ease-in-out ${
            isMenuOpen ? 'max-h-96 opacity-100 py-4' : 'max-h-0 opacity-0 py-0'
          }`}
          aria-label="Mobile navigation"
          aria-hidden={!isMenuOpen}
        >
          <div className="flex flex-col space-y-1 px-2">
            {navItems.map((item, index) => (
              <Link 
                key={item.name}
                href={item.path}
                aria-label={item.ariaLabel}
                className="text-gray-700 hover:text-black font-medium py-3 px-3 rounded-lg transition-all duration-300 hover:bg-gray-100 hover:translate-x-1 text-base"
                style={{ transitionDelay: `${index * 50}ms` }}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      <style jsx>{`
        @keyframes pulse-scale {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
        .animate-pulse-scale {
          animation: pulse-scale 2s ease-in-out infinite;
        }
        /* Style for Clerk UserButton */
        .cl-userButtonBox {
            width: 100%;
            height: 100%;
        }
        .cl-userButtonTrigger {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .cl-userButtonAvatarBox {
            width: 28px;
            height: 28px;
        }
      `}</style>
    </header>
  );
}


// 'use client';
// import { useState } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';

// export default function Navbar() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');

//   const navItems = [
//     { name: 'Home', path: '/', ariaLabel: 'Go to home page' },
//     { name: 'Products', path: '/products', ariaLabel: 'Browse all products' },
//     { name: 'On Sale', path: '/on-sale', ariaLabel: 'View sale items' },
//     { name: 'About Us', path: '/about-us', ariaLabel: 'Learn about us' },
//     { name: 'Contact Us', path: '/contact-us', ariaLabel: 'Contact us' }
//   ];

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       console.log('Searching for:', searchQuery);
//     }
//   };

//   return (
//     <header className="sticky top-0 z-50 bg-[#78B9B5] backdrop-blur-md border-b border-gray-200/80 shadow-sm">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16 lg:h-20">
          
//           {/* Logo */}
//           <div className="flex items-center flex-shrink-0">
//             <Link 
//               href="/" 
//               aria-label="Meyuza's Design - Go to homepage"
//               className="block"
//             >
//               <Image 
//                 src="/logos/logo1.png" 
//                 alt="Meyuza's Design Logo" 
//                 width={80}
//                 height={80}
//                 priority
//                 quality={90}
//                 className="w-20 h-auto lg:w-24 hover:scale-105 transition-transform duration-300"
//               />
//             </Link>
//           </div>

//           {/* Desktop Navigation - CENTER TO CORNERS ANIMATION */}
//           <nav 
//             className="hidden md:flex items-center space-x-6 lg:space-x-8"
//             aria-label="Main navigation"
//           >
//             {navItems.map((item) => (
//               <Link 
//                 key={item.name}
//                 href={item.path}
//                 aria-label={item.ariaLabel}
//                 className="relative text-[#016B61] hover:text-[#014a43] font-bold text-sm lg:text-base transition-colors duration-200 group py-4 px-2"
//               >
//                 {item.name}
//                 {/* Underline: CENTER TO BOTH CORNERS */}
//                 <span 
//                   className="absolute bottom-3 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#014a43] group-hover:w-full transition-all duration-700 ease-in-out" 
//                   aria-hidden="true"
//                 ></span>
//               </Link>
//             ))}
//           </nav>

//           {/* Desktop Search & Actions */}
//           <div className="hidden md:flex items-center space-x-3">
//             {/* Search Form */}
//             <form onSubmit={handleSearch} className="relative group">
//               <label htmlFor="search-desktop" className="sr-only">Search products</label>
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-transform duration-300 group-hover:scale-110">
//                 <svg className="h-4 w-4 text-gray-400 transition-colors duration-300 group-hover:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                 </svg>
//               </div>
              
//               <input
//                 id="search-desktop"
//                 type="search"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search for products..."
//                 className="pl-10 pr-12 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white w-48 lg:w-64 transition-all duration-300 hover:bg-gray-200 focus:shadow-lg focus:scale-105"
//                 aria-label="Search input"
//               />
              
//               <button 
//                 type="submit"
//                 className="absolute inset-y-0 right-0 pr-3 flex items-center opacity-0 focus:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 hover:scale-110"
//                 aria-label="Submit search"
//               >
//                 <svg className="h-4 w-4 text-gray-600 hover:text-black transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                 </svg>
//               </button>
//             </form>

//             {/* Cart Button */}
//             <Link
//               href="/Cart"
//               className="relative p-2 group hover:scale-105 rounded-lg  hover:bg-[#014a43] focus:ring-2 focus:ring-[#016B61] focus:ring-opacity-50 transition-all duration-300"
//               aria-label="View shopping cart"
//             >
//               <Image 
//                 src="/cart.png" 
//                 alt="Shopping cart icon" 
//                 width={24}
//                 height={24}
//                 className="transition-transform duration-300 group-hover:scale-110"
//               />
//               <span className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
//                 View Cart
//               </span>
//             </Link>

//             {/* User Profile */}
//             <Link
//               href="/account"
//               className="relative p-2 group hover:scale-105 rounded-lg hover:bg-[#014a43] focus:ring-2 focus:ring-[#016B61] focus:ring-opacity-50 transition-all duration-300"
//               aria-label="Go to my account"
//             >
//               <Image 
//                 src="/user.png" 
//                 alt="User account icon" 
//                 width={24}
//                 height={24}
//                 className="transition-transform duration-300 group-hover:scale-110"
//               />
//               <span className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
//                 My Account
//               </span>
//             </Link>
//           </div>

//           {/* Mobile Menu Buttons */}
//           <div className="md:hidden flex items-center space-x-2">
//             <button 
//               className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-black"
//               aria-label="Open search"
//               type="button"
//             >
//               <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//               </svg>
//             </button>
            
//             <button 
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//               className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-black"
//               aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
//               aria-expanded={isMenuOpen}
//               type="button"
//             >
//               <svg 
//                 className={`h-5 w-5 text-gray-700 transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : ''}`} 
//                 fill="none" 
//                 viewBox="0 0 24 24" 
//                 stroke="currentColor"
//                 aria-hidden="true"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//               </svg>
//             </button>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         <nav 
//           className={`md:hidden bg-white border-t border-gray-200 overflow-hidden transition-all duration-500 ease-in-out ${
//             isMenuOpen ? 'max-h-96 opacity-100 py-4' : 'max-h-0 opacity-0 py-0'
//           }`}
//           aria-label="Mobile navigation"
//           aria-hidden={!isMenuOpen}
//         >
//           <div className="flex flex-col space-y-3 px-4">
//             {navItems.map((item, index) => (
//               <Link 
//                 key={item.name}
//                 href={item.path}
//                 aria-label={item.ariaLabel}
//                 className="text-gray-700 hover:text-black font-medium py-2 px-3 rounded-lg transition-all duration-300 hover:bg-gray-100 hover:translate-x-2 hover:shadow-sm text-base"
//                 style={{ transitionDelay: `${index * 50}ms` }}
//                 onClick={() => setIsMenuOpen(false)}
//               >
//                 {item.name}
//               </Link>
//             ))}
            
//             {/* Mobile Search */}
//             <form onSubmit={handleSearch} className="relative mt-4 group">
//               <label htmlFor="search-mobile" className="sr-only">Search products</label>
//               <input
//                 id="search-mobile"
//                 type="search"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search for products..."
//                 className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all duration-300 focus:shadow-lg"
//               />
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
//                 <svg className="h-4 w-4 text-gray-400 transition-colors duration-300 group-focus-within:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                 </svg>
//               </div>
//             </form>
//           </div>
//         </nav>
//       </div>
//     </header>
//   );
// }