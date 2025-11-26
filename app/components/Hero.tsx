'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Slider folder se images - aapke public/slider/ folder ki images
  const rotationImages = [
    '/slider/1.jpg',
    '/slider/2.jpg', 
    '/slider/3.jpg',
    '/slider/4.jpg'
  ];

  useEffect(() => {
    setIsVisible(true);
    
    // Auto rotation every 3 seconds
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === rotationImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [rotationImages.length]);

  return (
    <section className="relative bg-[#9ECFD4] overflow-hidden border border-transparent">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-24">
          
          {/* Left Content */}
          <div className={`flex-1 text-center lg:text-left space-y-4 sm:space-y-6 lg:space-y-8 order-2 lg:order-1 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-xs sm:text-sm font-medium shadow-lg">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" aria-hidden="true"></span>
              50% off on your first order
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
              Wear{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-600">
                Your
              </span>{' '}
              Edge
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg lg:text-xl text-gray-700 max-w-2xl leading-relaxed mx-auto lg:mx-0">
              Discover the latest trends in clothing. From casual to formal, we have it all. 
              Shop now and get 50% off on your first order!
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Link 
                href="/products"
                className="bg-black text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:bg-[#014a43] transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 text-center"
                aria-label="Order products now"
              >
                Order Now →
              </Link>
              
              <Link
                href="/products"
                className="border-2 border-gray-700 text-gray-800 hover:text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:bg-[#014a43] transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 text-center"
                aria-label="Explore more products"
              >
                Explore More
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 lg:pt-12 max-w-md mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">200+</div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">International Brands</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">2,000+</div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">Quality Products</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">30,000+</div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">Happy Customers</div>
              </div>
            </div>
          </div>

          {/* Right Image Rotation */}
          <div className="flex-1 order-1 lg:order-2 relative w-full max-w-lg mx-auto lg:mx-0">
            <div className="relative h-64 sm:h-80 lg:h-96 xl:h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl">
              {rotationImages.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                    index === currentImageIndex
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 scale-105'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`Fashion image ${index + 1}`}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                  
                  {/* Overlay for better text visibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              ))}
              
              {/* Image indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                {rotationImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentImageIndex 
                        ? 'bg-white scale-125' 
                        : 'bg-white/50 hover:bg-white/80'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}