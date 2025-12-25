'use client';

import Image from 'next/image';

import { removeFromCart, clearCart } from '../../actions/actions';
import { useCart } from '../context/CartContext';


interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  _type: 'product' | 'onsaleproducts';
  discountPercentage?: number;
  currentPrice?: number;
}

interface OrderSummaryProps {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  subtotal: number;
  shipping: number;
  total: number;
  updateCartCount: () => void;
}

export default function OrderSummary({ cartItems, setCartItems, subtotal, shipping, updateCartCount }: OrderSummaryProps) {
  // Calculate total without tax but including shipping
  const finalTotal = subtotal + shipping;

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    updateCartCount();
  };

  const handleClearCart = () => {
    clearCart();
    setCartItems([]);
    updateCartCount();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24 border-2 border-[#9ECFD4]/30">
      <h2 className="text-xl font-bold text-[#016B61] mb-6 flex items-center gap-2">
        <svg className="w-6 h-6 text-[#016B61]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        Order Summary
      </h2>
      
      {cartItems.length > 0 && (
        <button
          onClick={handleClearCart}
          className="w-full mb-4 text-sm font-medium text-red-600 hover:text-red-800 transition-colors duration-300"
        >
          Clear Cart
        </button>
      )}


      {/* Cart Items */}
      <div className="space-y-4 mb-6 max-h-64 overflow-y-auto custom-scrollbar">
        {cartItems.map((item) => {
          const itemPrice = Number(item.price) || 0; // Original price
          const itemQty = Number(item.quantity) || 0;
          let displayPrice = itemPrice; // Default to original price
          let isDiscounted = false;

          if (item._type === 'onsaleproducts' && item.currentPrice !== undefined) {
              displayPrice = item.currentPrice;
              isDiscounted = true;
          }
          const totalItemPrice = displayPrice * itemQty;

          return (
            <div key={item.id} className="flex gap-3 pb-4 border-b border-[#9ECFD4]/30 last:border-0">
              <div className="w-16 h-16 bg-gradient-to-br from-[#9ECFD4]/20 to-[#78B9B5]/20 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                <Image
                  src={item.image} 
                  alt={item.name}
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-[#016B61] truncate">{item.name}</h3>
                <p className="text-sm text-[#016B61]/70">Qty: {item.quantity}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-sm font-bold text-[#016B61]">Rs. {totalItemPrice.toFixed(2)}</p>
                  {isDiscounted && (
                    <p className="text-xs font-medium text-red-500 line-through">Rs. {(itemPrice * itemQty).toFixed(2)}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleRemoveItem(item.id)}
                className="text-red-500 hover:text-red-700 transition-colors"
                aria-label={`Remove ${item.name}`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>

      {/* Pricing Breakdown - Tax Removed */}
      <div className="space-y-3 pb-4 border-b border-[#9ECFD4]/30">
        <div className="flex justify-between text-sm p-3 bg-[#9ECFD4]/10 rounded-lg">
          <span className="text-[#016B61] font-medium">Subtotal</span>
          <span className="font-semibold text-[#016B61]">Rs. {subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm p-3 bg-[#78B9B5]/10 rounded-lg border border-[#78B9B5]/30">
          <span className="text-[#016B61] font-medium flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            Shipping
          </span>
          <span className="font-semibold text-[#016B61]">
            {shipping === 0 ? (
              <span className="text-[#016B61] font-bold">-</span>
            ) : (
              `Rs. ${shipping.toFixed(2)}`
            )}
          </span>
        </div>
      </div>

      {/* Total - Including Shipping */}
      <div className="flex justify-between items-center mt-4 mb-6 p-4 bg-gradient-to-r from-[#9ECFD4]/20 to-[#78B9B5]/20 rounded-2xl border-2 border-[#78B9B5]/30">
        <span className="text-lg font-bold text-[#016B61]">Total</span>
        <span className="text-3xl font-black text-[#016B61]">Rs. {finalTotal.toFixed(2)}</span>
      </div>

      {/* Trust Badges */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm text-[#016B61] bg-gradient-to-r from-[#9ECFD4]/10 to-[#78B9B5]/10 p-3 rounded-lg border border-[#9ECFD4]/30">
          <svg className="w-5 h-5 text-[#016B61] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className="font-semibold">Secure Checkout</span>
        </div>

        <div className="flex items-center gap-3 text-sm text-[#016B61] bg-gradient-to-r from-[#78B9B5]/10 to-[#016B61]/10 p-3 rounded-lg border border-[#78B9B5]/30">
          <svg className="w-5 h-5 text-[#016B61] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <span className="font-semibold">Safe Payment</span>
        </div>

        <div className="flex items-center gap-3 text-sm text-[#016B61] bg-gradient-to-r from-[#9ECFD4]/10 to-[#78B9B5]/10 p-3 rounded-lg border border-[#9ECFD4]/30">
          <svg className="w-5 h-5 text-[#016B61] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          <span className="font-semibold">Easy Returns</span>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #9ECFD4;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #016B61;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #78B9B5;
        }
      `}</style>
    </div>
  );
}

// 1st code
// 'use client';

// interface CartItem {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
//   image: string;
// }

// interface OrderSummaryProps {
//   cartItems: CartItem[];
//   subtotal: number;
//   shipping: number;
//   tax: number;
//   total: number;
// }

// export default function OrderSummary({ cartItems, subtotal, shipping, tax, total }: OrderSummaryProps) {
//   return (
//     <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
//       <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
//         <svg className="w-6 h-6 text-[#016B61]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
//         </svg>
//         Order Summary
//       </h2>

//       {/* Cart Items */}
//       <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
//         {cartItems.map((item) => (
//           <div key={item.id} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0">
//             <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
//               <img 
//                 src={item.image} 
//                 alt={item.name}
//                 className="w-full h-full object-cover"
//               />
//             </div>
//             <div className="flex-1 min-w-0">
//               <h3 className="text-sm font-semibold text-gray-900 truncate">{item.name}</h3>
//               <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
//               <p className="text-sm font-bold text-[#016B61]">Rs. {(item.price * item.quantity).toFixed(2)}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Pricing Breakdown */}
//       <div className="space-y-3 pb-4 border-b border-gray-200">
//         <div className="flex justify-between text-sm">
//           <span className="text-gray-600">Subtotal</span>
//           <span className="font-semibold text-gray-900">Rs. {subtotal.toFixed(2)}</span>
//         </div>
        
//         <div className="flex justify-between text-sm">
//           <span className="text-gray-600">Shipping</span>
//           <span className="font-semibold text-gray-900">
//             {shipping === 0 ? (
//               <span className="text-green-600">FREE</span>
//             ) : (
//               `Rs. ${shipping.toFixed(2)}`
//             )}
//           </span>
//         </div>
        
//         <div className="flex justify-between text-sm">
//           <span className="text-gray-600">Tax (15%)</span>
//           <span className="font-semibold text-gray-900">Rs. {tax.toFixed(2)}</span>
//         </div>
//       </div>

//       {/* Total */}
//       <div className="flex justify-between items-center mt-4 mb-6">
//         <span className="text-lg font-bold text-gray-900">Total</span>
//         <span className="text-2xl font-bold text-[#016B61]">Rs. {total.toFixed(2)}</span>
//       </div>

//       {/* Trust Badges */}
//       <div className="space-y-3">
//         <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
//           <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//           </svg>
//           <span>Secure Checkout</span>
//         </div>

//         <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
//           <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
//           </svg>
//           <span>Safe Payment</span>
//         </div>

//         <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
//           <svg className="w-5 h-5 text-purple-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
//           </svg>
//           <span>Easy Returns</span>
//         </div>
//       </div>
//     </div>
//   );
// }