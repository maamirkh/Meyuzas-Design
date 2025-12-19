'use client';
import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

interface ProductProps {
  id: number;
  name: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice: number | null;
  image: string;
  slug: string;
}

export default function TopSellingClient({ products }: { products: ProductProps[] }) {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useIntersectionObserver(sectionRef, { threshold: 0.1, triggerOnce: true });

  const handleImageLoad = (id: number) => {
    setLoadedImages(prev => new Set(prev).add(id));
  };

  const renderStars = (rating: number, productName: string) => {
    return (
      <div className="flex items-center gap-1" role="img" aria-label={`${rating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-sm ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            aria-hidden="true"
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const calculateDiscount = (price: number, originalPrice: number) => {
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  return (
    <section
      ref={sectionRef}
      className={`bg-[#9ECFD4] py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 scroll-animate ${isVisible ? 'is-visible' : ''} border border-transparent`}
    >
      <div className="max-w-6xl mx-auto">

        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
            TOP SELLING
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            Our most popular products loved by thousands of customers
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-10">
          {products.map((product) => (
            <article
              key={product.id}
              className="group relative bg-white rounded-xl transition-all duration-500 hover:transform hover:scale-105"
            >
              <Link href={`/product/${product.slug}`} className="block">
                <div className="relative overflow-hidden rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-300 shadow-sm hover:shadow-md">

                  {/* Product Image */}
                  <div className="relative bg-gray-50 rounded-xl">
                    <div className="relative w-full h-64 sm:h-72 lg:h-80 overflow-hidden rounded-xl">
                      <Image
                        src={product.image}
                        alt={`${product.name} - Top selling at Meyuza's Design`}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        quality={85}
                        className="object-cover transition-all duration-700 group-hover:scale-110 rounded-xl"
                        onLoad={() => handleImageLoad(product.id)}
                        loading="lazy"
                        unoptimized
                      />

                      {/* Loading Skeleton */}
                      {!loadedImages.has(product.id) && (
                        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-xl" aria-hidden="true"></div>
                      )}
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-300 rounded-xl" aria-hidden="true"></div>

                    {/* Best Seller Badge */}
                    <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                      Best Seller
                    </div>

                    {/* Discount Badge */}
                    {product.originalPrice && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg">
                        -{calculateDiscount(product.price, product.originalPrice)}%
                      </div>
                    )}

                    {/* Wishlist Button */}
                    <button
                      className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white rounded-full p-1.5 shadow-lg hover:bg-gray-50"
                      aria-label={`Add ${product.name} to wishlist`}
                      type="button"
                    >
                      <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-2 sm:p-3 lg:p-4 space-y-1 sm:space-y-2">
                    <h3 className="font-semibold text-gray-900 text-xs sm:text-sm leading-tight group-hover:text-black transition-colors duration-200 line-clamp-2">
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1 sm:gap-2">
                      {renderStars(product.rating, product.name)}
                      <span className="text-xs text-gray-600">
                        ({product.reviews.toLocaleString()})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-base font-bold text-gray-900">
                        Rs. {product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs sm:text-sm text-gray-500 line-through">
                          Rs. {product.originalPrice}
                        </span>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      className="w-full bg-black text-white py-2 rounded-lg font-medium text-xs sm:text-sm opacity-0 group-hover:opacity-100 transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1"
                      aria-label={`Add ${product.name} to cart`}
                      type="button"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            href="/on-sale"
            className="inline-block border-2 border-gray-800 text-gray-800 px-6 sm:px-8 py-2 sm:py-3 rounded-full font-medium text-sm sm:text-base hover:bg-[#014a43] hover:text-white transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            aria-label="View all top selling products"
          >
            View All
          </Link>
        </div>
      </div>
    </section>
  );
}