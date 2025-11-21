import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import { ReactNode } from 'react';
import type { Metadata } from 'next';

// SEO Metadata Configuration
export const metadata: Metadata = {
  metadataBase: new URL('https://meyuzas-design.com'), // Replace with your actual domain
  title: {
    default: 'Meyuza\'s Design - Fashionable & Trendy Clothing for Everyone',
    template: '%s | Meyuza\'s Design'
  },
  description: 'Discover the latest trends in fashionable clothing at Meyuza\'s Design. Shop trendy apparel for men, women, and kids. Get 50% off on your first order!',
  keywords: ['fashion', 'clothing', 'trendy apparel', 'e-commerce', 'online shopping', 'mens fashion', 'womens fashion', 'kids clothing', 'Meyuzas Design'],
  authors: [{ name: 'Meyuza\'s Design' }],
  creator: 'Meyuza\'s Design',
  publisher: 'Meyuza\'s Design',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  // Open Graph Metadata (for Facebook, LinkedIn)
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://meyuzas-design.com',
    siteName: 'Meyuza\'s Design',
    title: 'Meyuza\'s Design - Fashionable & Trendy Clothing',
    description: 'Shop the latest fashion trends. Get 50% off on your first order!',
    images: [
      {
        url: '/og-image.png', // Add this image to your public folder
        width: 1200,
        height: 630,
        alt: 'Meyuza\'s Design - Fashion Collection',
      }
    ],
  },
  // Twitter Card Metadata
  twitter: {
    card: 'summary_large_image',
    title: 'Meyuza\'s Design - Fashionable & Trendy Clothing',
    description: 'Shop the latest fashion trends. Get 50% off on your first order!',
    images: ['/twitter-image.png'], // Add this image to your public folder
    creator: '@meyuzasdesign', // Replace with your Twitter handle
  },
  // Robots Configuration
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // Icons
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  // Manifest for PWA
  manifest: '/site.webmanifest',
};

// Viewport Configuration
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' }
  ],
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to improve performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ClothingStore',
              name: 'Meyuza\'s Design',
              description: 'Fashionable and trendy clothing for everyone',
              url: 'https://meyuzas-design.com',
              logo: 'https://meyuzas-design.com/Meyuza\'s Logo.png',
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'PK'
              },
              openingHoursSpecification: {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                opens: '00:00',
                closes: '23:59'
              },
              priceRange: '$$',
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                reviewCount: '10000'
              }
            })
          }}
        />
      </head>
      <body className="antialiased text-gray-900 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}