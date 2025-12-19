import FetchSaleProductsPage from "../fetchSaleProducts/page"
export default function OnSale(){
  return (
    <div>
      <div className="text-center mb-8 sm:mb-8 lg:mb-10 mt-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
            ON SALE PRODUCTS
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            Our most popular products loved by thousands of customers
          </p>
        </div>
      <div>
      <FetchSaleProductsPage/>
      </div>
    </div>
  )
}
// import CountdownTimer from '../components/CountdownTimer';
// import ProductCard from '../components/ProductCard';

// const saleProducts = [
//   { id: 1, name: 'Elegant High Heels', price: 'Rs. 79.99', originalPrice: 'Rs. 129.99', image: '/product1.png', isSale: true },
//   { id: 2, name: 'Vintage Leather Jacket', price: 'Rs. 129.99', originalPrice: 'Rs. 199.99', image: '/product2.png', isSale: true },
//   { id: 3, name: 'Classic Chronograph Watch', price: 'Rs. 149.99', originalPrice: 'Rs. 249.99', image: '/product3.png', isSale: true },
//   { id: 4, name: 'Designer Sunglasses', price: 'Rs. 59.99', originalPrice: 'Rs. 99.99', image: '/product4.png', isSale: true },
//   { id: 5, name: 'Silk Scarf', price: 'Rs. 29.99', originalPrice: 'Rs. 49.99', image: '/product1.png', isSale: true },
//   { id: 6, name: 'Leather Tote Bag', price: 'Rs. 89.99', originalPrice: 'Rs. 149.99', image: '/product2.png', isSale: true },
//   { id: 7, name: 'Cashmere Sweater', price: 'Rs. 99.99', originalPrice: 'Rs. 179.99', image: '/product3.png', isSale: true },
//   { id: 8, name: 'Suede Ankle Boots', price: 'Rs. 119.99', originalPrice: 'Rs. 189.99', image: '/product4.png', isSale: true },
// ];

// const SalePage = () => {
//   return (
//     <div className="min-h-screen bg-[#9ECFD4]">
      
//       {/* Hero Section */}
//       <div className="relative bg-gradient-to-br from-[#016B61] to-[#78B9B5] text-white py-24 lg:py-32 px-4 overflow-hidden">
//         {/* Animated Background Elements */}
//         <div className="absolute inset-0 overflow-hidden">
//           <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
//           <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
//         </div>
        
//         <div className="relative z-10 max-w-6xl mx-auto text-center">
//           {/* Mid-Season Text */}
//           <h1 className="text-3xl lg:text-4xl font-light uppercase tracking-widest mb-6 opacity-90">
//             Mid-Season
//           </h1>
          
//           {/* Sale Text with Gradient Effect */}
//           <div className="my-8">
//             <span className="text-7xl lg:text-9xl font-black uppercase bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent drop-shadow-2xl animate-pulse">
//               SALE
//             </span>
//           </div>
          
//           {/* Description */}
//           <p className="text-lg lg:text-xl max-w-2xl mx-auto mb-8 opacity-95 leading-relaxed">
//             Enjoy spectacular savings on our new collection. Limited time only! 
//             Don't miss out on these exclusive deals.
//           </p>
          
//           {/* Countdown Timer */}
//           <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 lg:p-8 max-w-2xl mx-auto border border-white/20">
//             <CountdownTimer targetDate="2025-12-01T00:00:00" />
//           </div>
          
//           {/* CTA Button */}
//           <button className="mt-8 bg-white text-[#016B61] px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 border-2 border-transparent hover:border-white shadow-lg">
//             Shop Now & Save
//           </button>
//         </div>
//       </div>

//       {/* Products Section */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
//         {/* Section Header */}
//         <div className="text-center mb-12 lg:mb-16">
//           <h2 className="text-3xl lg:text-4xl font-bold text-black mb-4">
//             ON SALE PRODUCTS
//           </h2>
//           <div className="w-24 h-1.5 bg-[#016B61] mx-auto mb-6 rounded-full"></div>
//           <p className="text-lg text-gray-800 max-w-2xl mx-auto">
//             Discover amazing deals on our premium collection. Limited stock available at these exclusive prices!
//           </p>
//         </div>

//         {/* Products Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
//           {saleProducts.map((product) => (
//             <div key={product.id} className="transform hover:scale-105 transition-transform duration-300">
//               <ProductCard product={product} />
//             </div>
//           ))}
//         </div>

//         {/* Additional CTA */}
//         <div className="text-center mt-16">
//           <div className="bg-white rounded-2xl p-8 lg:p-12 max-w-4xl mx-auto border-2 border-[#016B61] shadow-lg">
//             <h3 className="text-2xl lg:text-3xl font-bold text-black mb-4">
//               Limited Time Offer!
//             </h3>
//             <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
//               These prices won't last long. Shop now before the sale ends and save big on your favorite items.
//             </p>
//             <button className="bg-[#016B61] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#014a43] transition-all duration-300 transform hover:scale-105 border-2 border-transparent hover:border-white">
//               View All Sale Items
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SalePage;