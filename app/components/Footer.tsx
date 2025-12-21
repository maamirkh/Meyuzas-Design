'use client';
import Link from 'next/link';
import { JSX } from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'About Us', href: '/about-us', ariaLabel: 'Learn about Meyuza&apos;s Design' },
      // { name: 'Customer Support', href: '/support', ariaLabel: 'Get customer support' },
      { name: 'Terms & Conditions', href: '/terms-conditions', ariaLabel: 'Read terms and conditions' }
    ],
    resources: [
      { name: 'Facebook', href: 'https://www.facebook.com/meyuza85?rdid=Y5eciwGgcURUg02g&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1Bo2uSDNXc%2F#', icon: 'facebook', ariaLabel: 'Visit our Facebook page' },
      { name: 'Instagram', href: 'https://www.instagram.com/meyuzas/?utm_source=qr#', icon: 'instagram', ariaLabel: 'Visit our Instagram profile' },
      { name: 'WhatsApp', href: 'https://wa.me/+923122401741', icon: 'whatsapp', ariaLabel: 'Chat with us on WhatsApp' },
      { name: 'YouTube Playlist', href: 'https://youtube.com/@meyuzasdesign?si=_3-qdvM0JNZvvhKo', icon: 'youtube', ariaLabel: 'Watch our YouTube videos' }
    ]
  };

  const socialMedia = [
    { name: 'Facebook', href: 'https://www.facebook.com/meyuza85?rdid=Y5eciwGgcURUg02g&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1Bo2uSDNXc%2F#', icon: 'facebook', ariaLabel: 'Follow us on Facebook' },
    { name: 'Instagram', href: 'https://www.instagram.com/meyuzas/?utm_source=qr#', icon: 'instagram', ariaLabel: 'Follow us on Instagram' },
    { name: 'Twitter', href: 'https://twitter.com', icon: 'twitter', ariaLabel: 'Follow us on Twitter' },
    { name: 'WhatsApp', href: 'https://wa.me/+923122401741', icon: 'whatsapp', ariaLabel: 'Chat with us on WhatsApp' }
  ];

  const getSocialIcon = (iconName: string) => {
    const icons: Record<string, JSX.Element> = {
      facebook: (
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      ),
      instagram: (
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      ),
      twitter: (
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.016 10.016 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.543l-.047-.02z"/>
      ),
      youtube: (
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      ),
      whatsapp: (
        <path d="M17.472 14.38c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893-.001-3.189-1.262-6.187-3.553-8.443"/>
      )
    };
    return icons[iconName] || null;
  };

  return (
    <footer className="bg-[#78B9B5] text-[#016B61] border-t border-[#016B61]/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        
        {/* Main Footer Grid - Now 3 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 mb-6 lg:mb-8">
          
          {/* Brand Section */}
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
              <div className="w-6 h-6 bg-[#016B61] rounded-full flex items-center justify-center" aria-hidden="true">
                <span className="text-white font-bold text-xs">M</span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-[#016B61]">Meyuza&apos;s Design</span>
            </div>
            <p className="text-[#016B61]/80 text-xs leading-relaxed mb-4 text-center sm:text-left">
              We offer trendy and fashionable clothing for everyone. Discover the latest styles and express your unique personality.
            </p>
            
            {/* Social Media Icons - WhatsApp added */}
            <div className="flex items-center justify-center sm:justify-start gap-3" role="list" aria-label="Social media links">
              {socialMedia.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.ariaLabel}
                  className={`bg-[#016B61]/10 hover:bg-[#016B61] p-2 rounded-lg transition-all duration-300 transform hover:scale-110 hover:shadow-lg group ${
                    social.icon === 'whatsapp' ? 'hover:bg-green-500' : ''
                  }`}
                >
                  <svg 
                    className={`w-4 h-4 transition-colors duration-300 group-hover:text-white ${
                      social.icon === 'whatsapp' ? 'text-green-600' : 'text-[#016B61]'
                    }`} 
                    fill="currentColor" 
                    viewBox="0 0 24 24" 
                    aria-hidden="true"
                  >
                    {getSocialIcon(social.icon)}
                  </svg>
                </Link>
              ))}
            </div>
          </div>

          {/* Company Links - CENTERED */}
          <nav className="text-center" aria-labelledby="footer-company-heading">
            <h3 id="footer-company-heading" className="font-semibold text-sm sm:text-base mb-3 text-[#016B61]">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    aria-label={item.ariaLabel}
                    className="relative inline-block text-[#016B61]/80 hover:text-[#016B61] transition-colors duration-300 text-xs sm:text-sm group"
                  >
                    <span className="relative">
                      {item.name}
                      {/* Underline: LEFT TO RIGHT */}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#016B61] group-hover:w-full transition-all duration-700 ease-out"></span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Resources Section - WhatsApp added */}
          <nav className="text-center sm:text-right" aria-labelledby="footer-resources-heading">
            <h3 id="footer-resources-heading" className="font-semibold text-sm sm:text-base mb-3 text-[#016B61]">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.ariaLabel}
                    className="relative inline-flex items-center justify-center sm:justify-end gap-2 text-[#016B61]/80 hover:text-[#016B61] transition-colors duration-300 text-xs sm:text-sm group"
                  >
                    <svg 
                      className={`w-3 h-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-300 ${
                        item.icon === 'whatsapp' ? 'text-green-600' : ''
                      }`} 
                      fill="currentColor" 
                      viewBox="0 0 24 24" 
                      aria-hidden="true"
                    >
                      {getSocialIcon(item.icon)}
                    </svg>
                    <span className="relative">
                      {item.name}
                      {/* Underline: LEFT TO RIGHT */}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#016B61] group-hover:w-full transition-all duration-700 ease-out"></span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-[#016B61]/20 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
            <p className="text-[#016B61]/80 text-xs text-center md:text-left">
              © {currentYear} Meyuza&apos;s Design. Powered by DevNity InnoVations. All rights reserved.
            </p>
            
            {/* Payment Methods */}
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <div className="text-[#016B61]/80 text-xs font-medium">We accept:</div>
              <div className="flex items-center gap-2" role="list" aria-label="Accepted payment methods">
                
                {/* Visa Card */}
                <div className="bg-white border-2 border-gray-200 p-2 rounded-lg hover:scale-110 hover:border-blue-500 hover:shadow-lg transition-all duration-300" role="listitem" aria-label="Visa accepted">
                  <svg className="w-10 h-7" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="48" height="32" rx="4" fill="white"/>
                    <path d="M19.5 21L21.9 11H24.3L21.9 21H19.5Z" fill="#00579F"/>
                    <path d="M32.1 11.3C31.6 11.1 30.8 10.9 29.8 10.9C27.3 10.9 25.6 12.2 25.6 14C25.6 15.3 26.8 16 27.7 16.4C28.7 16.8 29 17.1 29 17.5C29 18.1 28.3 18.4 27.6 18.4C26.6 18.4 26.1 18.3 25.3 17.9L25 17.8L24.7 19.6C25.3 19.9 26.4 20.1 27.5 20.1C30.2 20.1 31.8 18.8 31.8 17C31.8 16 31.1 15.3 29.6 14.7C28.7 14.3 28.2 14 28.2 13.6C28.2 13.2 28.7 12.8 29.6 12.8C30.4 12.8 31 12.9 31.5 13.2L31.7 13.3L32.1 11.3Z" fill="#00579F"/>
                    <path d="M35.8 11H33.9C33.3 11 32.9 11.2 32.6 11.7L28.8 21H31.5L32 19.5H35.3L35.6 21H38L35.8 11ZM32.7 17.7L33.9 14.4L34.6 17.7H32.7Z" fill="#00579F"/>
                    <path d="M16.5 11L14 18.5L13.7 17.2C13.2 15.6 11.7 13.8 10 12.9L12.2 21H14.9L18.5 11H16.5Z" fill="#00579F"/>
                    <path d="M11.3 11H7.5L7.5 11.2C10.7 12 12.8 14.3 13.5 17.2L12.7 11.7C12.6 11.2 12.2 11 11.7 11H11.3Z" fill="#FAA61A"/>
                  </svg>
                </div>

                {/* Mastercard */}
                <div className="bg-white border-2 border-gray-200 p-2 rounded-lg hover:scale-110 hover:border-red-500 hover:shadow-lg transition-all duration-300" role="listitem" aria-label="Mastercard accepted">
                  <svg className="w-10 h-7" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="48" height="32" rx="4" fill="white"/>
                    <circle cx="18" cy="16" r="9" fill="#EB001B"/>
                    <circle cx="30" cy="16" r="9" fill="#F79E1B"/>
                    <path d="M24 9.5C22.4 10.8 21.3 12.8 21.3 15C21.3 17.2 22.4 19.2 24 20.5C25.6 19.2 26.7 17.2 26.7 15C26.7 12.8 25.6 10.8 24 9.5Z" fill="#FF5F00"/>
                  </svg>
                </div>

                {/* JazzCash */}
                <div className="bg-white border-2 border-gray-200 p-2 rounded-lg hover:scale-110 hover:border-red-600 hover:shadow-lg transition-all duration-300" role="listitem" aria-label="JazzCash accepted">
                  <svg className="w-10 h-7" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="48" height="32" rx="4" fill="#DC0000"/>
                    <text x="24" y="19" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="bold" fill="white" textAnchor="middle">Jazz</text>
                    <text x="24" y="28" fontFamily="Arial, sans-serif" fontSize="7" fill="white" textAnchor="middle">Cash</text>
                  </svg>
                </div>

                {/* Easypaisa */}
                <div className="bg-white border-2 border-gray-200 p-2 rounded-lg hover:scale-110 hover:border-green-600 hover:shadow-lg transition-all duration-300" role="listitem" aria-label="Easypaisa accepted">
                  <svg className="w-10 h-7" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="48" height="32" rx="4" fill="#7AC143"/>
                    <text x="24" y="17" fontFamily="Arial, sans-serif" fontSize="9" fontWeight="bold" fill="white" textAnchor="middle">easy</text>
                    <text x="24" y="26" fontFamily="Arial, sans-serif" fontSize="7" fill="white" textAnchor="middle">paisa</text>
                  </svg>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}