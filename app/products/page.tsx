import Image from 'next/image';
import ProductsPage from '../fetchProduct/page';

export default function products () {

  return (
    <div>
        <ProductsPage/>
    </div>
  )
}
// const products = [
//   {
//     id: 1,
//     name: "T-shirt with Tape Details",
//     category: "Shirts",
//     price: 120,
//     originalPrice: 140,
//     rating: 4.5,
//     reviews: 1450,
//     image: "/product1.png",
//     isNew: true,
//     discount: 14
//   },
//   {
//     id: 2,
//     name: "Skinny Fit Jeans",
//     category: "Jeans", 
//     price: 240,
//     originalPrice: 260,
//     rating: 4.3,
//     reviews: 1300,
//     image: "/product2.png",
//     isNew: false,
//     discount: 8
//   },
//   {
//     id: 3,
//     name: "Checkered Shirt",
//     category: "Shirts",
//     price: 180,
//     originalPrice: null,
//     rating: 4.7,
//     reviews: 1400,
//     image: "/product3.png",
//     isNew: true,
//     discount: null
//   },
//   {
//     id: 4,
//     name: "Sleeve Striped T-shirt",
//     category: "Shirts",
//     price: 130,
//     originalPrice: 160,
//     rating: 4.6,
//     reviews: 1400,
//     image: "/product4.png",
//     isNew: false,
//     discount: 19
//   },
//   {
//     id: 5,
//     name: "Vertical Striped Shirt",
//     category: "Shirts",
//     price: 212,
//     originalPrice: 232,
//     rating: 4.8,
//     reviews: 1500,
//     image: "/product1.png",
//     isNew: true,
//     discount: 9
//   },
//   {
//     id: 6,
//     name: "Courage Graphic T-shirt",
//     category: "T-shirts",
//     price: 145,
//     originalPrice: null,
//     rating: 4.4,
//     reviews: 1200,
//     image: "/product2.png",
//     isNew: false,
//     discount: null
//   },
//   {
//     id: 7,
//     name: "Loose Fit Bermuda Shorts",
//     category: "Shorts",
//     price: 80,
//     originalPrice: 100,
//     rating: 4.2,
//     reviews: 900,
//     image: "/product3.png",
//     isNew: true,
//     discount: 20
//   },
//   {
//     id: 8,
//     name: "Faded Skinny Jeans",
//     category: "Jeans",
//     price: 210,
//     originalPrice: null,
//     rating: 4.9,
//     reviews: 1800,
//     image: "/product4.png",
//     isNew: false,
//     discount: null
//   }
// ];

// export default function Products() {
//   const renderStars = (rating: number) => {
//     return (
//       <div className="flex items-center gap-1">
//         {[1, 2, 3, 4, 5].map((star) => (
//           <span 
//             key={star} 
//             className={`text-sm ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
//           >
//             ★
//           </span>
//         ))}
//         <span className="text-xs text-gray-600 ml-1">({rating})</span>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-[#9ECFD4]">
//       {/* Header Section */}
//       <div className="bg-[#9ECFD4] pt-24 pb-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center">
//             <h1 className="text-4xl lg:text-5xl font-bold text-black mb-4">
//               Our Products
//             </h1>
//             <p className="text-lg text-gray-800 max-w-2xl mx-auto">
//               Discover our amazing collection of trendy and fashionable clothing for everyone
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Products Grid */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         {/* Products Count */}
//         <div className="mb-8">
//           <p className="text-gray-700">
//             Showing all {products.length} products
//           </p>
//         </div>

//         {/* Products Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {products.map((product) => (
//             <div 
//               key={product.id}
//               className="bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:transform hover:scale-105 border-2 border-transparent hover:border-black group"
//             >
//               {/* Product Image with Next.js Image */}
//               <div className="relative bg-gray-100">
//                 <div className="w-full h-80 overflow-hidden relative">
//                   <Image 
//                     src={product.image} 
//                     alt={product.name}
//                     fill
//                     sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
//                     className="object-cover transition-all duration-700 group-hover:scale-110"
//                     placeholder="blur"
//                     blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R"
//                   />
//                 </div>
                
//                 {/* Badges */}
//                 <div className="absolute top-3 left-3 flex gap-2">
//                   {product.isNew && (
//                     <span className="bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
//                       NEW
//                     </span>
//                   )}
//                   {product.discount && (
//                     <span className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
//                       -{product.discount}%
//                     </span>
//                   )}
//                 </div>

//                 {/* Quick Actions */}
//                 <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
//                   <button 
//                     className="bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors duration-200"
//                     aria-label={`Add ${product.name} to wishlist`}
//                   >
//                     <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//                     </svg>
//                   </button>
//                 </div>
//               </div>

//               {/* Product Info */}
//               <div className="p-4 space-y-3">
//                 {/* Category */}
//                 <p className="text-xs text-gray-500 uppercase tracking-wide">
//                   {product.category}
//                 </p>

//                 {/* Product Name */}
//                 <h3 className="font-semibold text-black text-lg leading-tight">
//                   {product.name}
//                 </h3>

//                 {/* Rating */}
//                 {renderStars(product.rating)}
//                 <p className="text-xs text-gray-600">
//                   {product.reviews.toLocaleString()} reviews
//                 </p>

//                 {/* Price */}
//                 <div className="flex items-center gap-2">
//                   <span className="text-xl font-bold text-black">
//                     ${product.price}
//                   </span>
//                   {product.originalPrice && (
//                     <span className="text-lg text-gray-500 line-through">
//                       ${product.originalPrice}
//                     </span>
//                   )}
//                 </div>

//                 {/* Add to Cart Button */}
//                 <button 
//                   className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 border-2 border-transparent hover:border-white"
//                   aria-label={`Add ${product.name} to cart`}
//                 >
//                   Add to Cart
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }