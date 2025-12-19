'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

interface Product {
  id: number;
  name: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice: number | null;
  image: string;
  slug: string;
  category: string;
}

const topSellingProducts: Product[] = [
  {
    id: 1,
    name: "Classic White T-Shirt",
    rating: 5,
    reviews: 3200,
    price: 99,
    originalPrice: null,
    image: "/product1.png",
    slug: "classic-white-tshirt",
    category: "T-Shirts"
  },
  {
    id: 2,
    name: "Premium Denim Jeans",
    rating: 5,
    reviews: 2850,
    price: 299,
    originalPrice: 399,
    image: "/product2.png",
    slug: "premium-denim-jeans",
    category: "Jeans"
  },
  {
    id: 3,
    name: "Casual Checkered Shirt",
    rating: 4,
    reviews: 2400,
    price: 199,
    originalPrice: null,
    image: "/product3.png",
    slug: "casual-checkered-shirt",
    category: "Shirts"
  },
  {
    id: 4,
    name: "Striped Cotton T-Shirt",
    rating: 5,
    reviews: 3100,
    price: 149,
    originalPrice: 199,
    image: "/product4.png",
    slug: "striped-cotton-tshirt",
    category: "T-Shirts"
  },
  {
    id: 5,
    name: "Vintage Denim Jacket",
    rating: 5,
    reviews: 2650,
    price: 499,
    originalPrice: null,
    image: "/product1.png",
    slug: "vintage-denim-jacket",
    category: "Jackets"
  },
  {
    id: 6,
    name: "Slim Fit Black Jeans",
    rating: 4,
    reviews: 2200,
    price: 279,
    originalPrice: 349,
    image: "/product2.png",
    slug: "slim-fit-black-jeans",
    category: "Jeans"
  },
  {
    id: 7,
    name: "Polo Neck T-Shirt",
    rating: 5,
    reviews: 1950,
    price: 179,
    originalPrice: null,
    image: "/product3.png",
    slug: "polo-neck-tshirt",
    category: "T-Shirts"
  },
  {
    id: 8,
    name: "Graphic Print Hoodie",
    rating: 5,
    reviews: 2800,
    price: 399,
    originalPrice: 499,
    image: "/product4.png",
    slug: "graphic-print-hoodie",
    category: "Hoodies"
  },
  {
    id: 9,
    name: "Casual Oxford Shirt",
    rating: 4,
    reviews: 1800,
    price: 229,
    originalPrice: null,
    image: "/product1.png",
    slug: "casual-oxford-shirt",
    category: "Shirts"
  },
  {
    id: 10,
    name: "Cargo Pants - Olive",
    rating: 5,
    reviews: 2100,
    price: 349,
    originalPrice: 449,
    image: "/product2.png",
    slug: "cargo-pants-olive",
    category: "Pants"
  },
  {
    id: 11,
    name: "V-Neck Cotton T-Shirt",
    rating: 5,
    reviews: 1650,
    price: 129,
    originalPrice: null,
    image: "/product3.png",
    slug: "vneck-cotton-tshirt",
    category: "T-Shirts"
  },
  {
    id: 12,
    name: "Bomber Jacket - Navy",
    rating: 4,
    reviews: 1900,
    price: 599,
    originalPrice: 699,
    image: "/product4.png",
    slug: "bomber-jacket-navy",
    category: "Jackets"
  }
];

export default function TopSellingPage() {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'T-Shirts', 'Jeans', 'Shirts', 'Jackets', 'Hoodies', 'Pants'];

  const filteredProducts = selectedCategory === 'All' 
    ? topSellingProducts 
    : topSellingProducts.filter(p => p.category === selectedCategory);

  const handleImageLoad = (id: number) => {
    setLoadedImages(prev => new Set(prev).add(id));
  };

  const renderStars = (rating: number) => {
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
    <div className="min-h-screen bg-[#9ECFD4]">
      {/* Hero Header */}
      <section className="bg-[#78B9B5] py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#016B61] mb-4">
            Top Selling Products
          </h1>
          <p className="text-[#016B61]/80 text-base sm:text-lg max-w-2xl mx-auto">
            Discover our most popular items loved by thousands of customers worldwide
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 sm:px-6 py-2 rounded-full font-medium text-sm sm:text-base transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category
                    ? 'bg-[#016B61] text-white shadow-lg'
                    : 'bg-white text-[#016B61] hover:bg-[#016B61] hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {filteredProducts.map((product) => (
              <article 
                key={product.id}
                className="group relative bg-white rounded-xl transition-all duration-500 hover:transform hover:scale-105"
              >
                <Link href={`/product/${product.slug}`} className="block">
                  <div className="relative overflow-hidden rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-300 shadow-sm hover:shadow-md">
                    
                    {/* Product Image */}
                    <div className="relative bg-gray-50 rounded-xl">
                      <div className="relative w-full h-64 sm:h-72 lg:h-80 overflow-hidden rounded-xl">
                        <img 
                          src={product.image} 
                          alt={`${product.name} - Top selling at Meyuza's Design`}
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 rounded-xl"
                          onLoad={() => handleImageLoad(product.id)}
                          loading="lazy"
                        />
                        
                        {/* Loading Skeleton */}
                        {!loadedImages.has(product.id) && (
                          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-xl" aria-hidden="true"></div>
                        )}
                      </div>
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-300 rounded-xl" aria-hidden="true"></div>
                      
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

                      {/* Category Badge */}
                      <div className="inline-block">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {product.category}
                        </span>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-1 sm:gap-2">
                        {renderStars(product.rating)}
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

          {/* No Results Message */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#016B61] text-lg">No products found in this category.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}