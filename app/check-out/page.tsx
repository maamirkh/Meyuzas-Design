'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PaymentForm from '../components/PaymentForm';
import OrderSummary from '../components/OrderSummary';
import { Product } from '../../types/product';
import { getCartItems, clearCart } from '../../actions/actions';
import { useCart } from '../context/CartContext';
import { urlFor } from '@/sanity/lib/image'; // ✅ Add this import

// Checkout expects this format
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

export default function CheckoutPage() {
  const router = useRouter();
  const { updateCartCount } = useCart();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCartItems = () => {
      try {
        const sanityCartItems: Product[] = getCartItems();
        
        if (!sanityCartItems || sanityCartItems.length === 0) {
          router.push('/Cart');
          return;
        }

        // ✅ FIX: Properly convert Sanity image to URL
        const formattedItems: CartItem[] = sanityCartItems.map(item => ({
          id: item._id,
          name: item.productName,
          price: Number(item.price) || 0,
          quantity: Number(item.inventory) || 1,
          image: item.image?.asset ? urlFor(item.image).url() : '/placeholder.png', // ✅ Fixed
          _type: item._type,
          discountPercentage: item.discountPercentage,
        }));

        setCartItems(formattedItems);
      } catch (error) {
        console.error('Error loading cart:', error);
        router.push('/Cart');
      } finally {
        setIsLoading(false);
      }
    };

    loadCartItems();
  }, [router]);

  const handleOrderComplete = () => {
    clearCart();
    setCartItems([]);
    updateCartCount();
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const itemPrice = Number(item.price) || 0;
    const itemQty = Number(item.quantity) || 0;
    let priceToUse = itemPrice;

    if (item._type === 'onsaleproducts' && item.currentPrice !== undefined) {
      priceToUse = item.currentPrice;
    }
    return sum + (priceToUse * itemQty);
  }, 0);
  
  const shipping = subtotal > 0 ? 0 : 0;
  const tax = 0;
  const total = subtotal + shipping;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#9ECFD4] via-[#78B9B5] to-[#016B61]/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#78B9B5] border-t-[#016B61] mx-auto mb-4"></div>
          <p className="text-[#016B61] font-medium">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#9ECFD4] via-[#78B9B5] to-[#016B61]/20 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border-2 border-[#9ECFD4]">
          <div className="w-16 h-16 bg-[#9ECFD4]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#016B61]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#016B61] mb-2">Cart is Empty</h2>
          <p className="text-[#016B61]/70 mb-6">Please add items to your cart before checkout.</p>
          <button
            onClick={() => router.push('/fetchProduct')}
            className="inline-block bg-gradient-to-r from-[#9ECFD4] via-[#78B9B5] to-[#016B61] hover:from-[#78B9B5] hover:via-[#016B61] hover:to-[#9ECFD4] text-black px-8 py-3 rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#9ECFD4] via-[#78B9B5] to-[#016B61]/20 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-slide-down">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#016B61] hover:text-[#78B9B5] font-medium transition-colors duration-300 mb-4 group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Cart
          </button>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#016B61] mb-2">Secure Checkout</h1>
          <p className="text-[#016B61]/80">Complete your order in a few simple steps</p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left: Payment Form */}
          <div className="lg:col-span-2">
            <PaymentForm 
              cartItems={cartItems}
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              total={total}
              onOrderComplete={handleOrderComplete}
            />
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              cartItems={cartItems}
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              total={total}
            />
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 bg-white/50 backdrop-blur-sm rounded-xl p-4 border-2 border-[#9ECFD4]/30 animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-[#016B61]/10 rounded-lg">
              <svg className="w-6 h-6 text-[#016B61] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-[#016B61] mb-1">🔒 Secure Checkout</h3>
              <p className="text-sm text-[#016B61]/80">
                Your payment information is encrypted and secure. We never store your payment details.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down {
          animation: slide-down 0.5s ease-out;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}


// 'use client';
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import PaymentForm from '../components/PaymentForm';
// import OrderSummary from '../components/OrderSummary';
// import { Product } from '../../types/product';
// import { getCartItems } from '../../actions/actions';

// // Checkout expects this format
// interface CartItem {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
//   image: string;
// }

// export default function CheckoutPage() {
//   const router = useRouter();
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const loadCartItems = () => {
//       try {
//         // Get Sanity cart items
//         const sanityCartItems: Product[] = getCartItems();
        
//         if (!sanityCartItems || sanityCartItems.length === 0) {
//           router.push('/cart');
//           return;
//         }

//         // Convert Sanity format to Checkout format
//         const formattedItems: CartItem[] = sanityCartItems.map(item => ({
//           id: item._id,
//           name: item.productName,
//           price: Number(item.price) || 0,
//           quantity: Number(item.inventory) || 1,
//           image: typeof item.image === 'string' ? item.image : '/placeholder.png'
//         }));

//         setCartItems(formattedItems);
//       } catch (error) {
//         console.error('Error loading cart:', error);
//         router.push('/cart');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadCartItems();
//   }, [router]);

//   // Calculate totals with proper validation
//   const subtotal = cartItems.reduce((sum, item) => {
//     const itemPrice = Number(item.price) || 0;
//     const itemQty = Number(item.quantity) || 0;
//     return sum + (itemPrice * itemQty);
//   }, 0);
  
//   const shipping = subtotal > 0 ? 0 : 0; // Free shipping
//   const tax = 0; // Tax removed as per requirement
//   const total = subtotal + shipping;

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-[#9ECFD4] via-[#78B9B5] to-[#016B61]/20 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#78B9B5] border-t-[#016B61] mx-auto mb-4"></div>
//           <p className="text-[#016B61] font-medium">Loading checkout...</p>
//         </div>
//       </div>
//     );
//   }

//   if (cartItems.length === 0) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-[#9ECFD4] via-[#78B9B5] to-[#016B61]/20 flex items-center justify-center px-4">
//         <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border-2 border-[#9ECFD4]">
//           <div className="w-16 h-16 bg-[#9ECFD4]/20 rounded-full flex items-center justify-center mx-auto mb-4">
//             <svg className="w-8 h-8 text-[#016B61]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </div>
//           <h2 className="text-2xl font-bold text-[#016B61] mb-2">Cart is Empty</h2>
//           <p className="text-[#016B61]/70 mb-6">Please add items to your cart before checkout.</p>
//           <button
//             onClick={() => router.push('/products')}
//             className="bg-gradient-to-r from-[#9ECFD4] via-[#78B9B5] to-[#016B61] text-black px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
//           >
//             Continue Shopping
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#9ECFD4] via-[#78B9B5] to-[#016B61]/20 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8 animate-slide-down">
//           <button
//             onClick={() => router.back()}
//             className="flex items-center gap-2 text-[#016B61] hover:text-[#78B9B5] font-medium transition-colors duration-300 mb-4 group"
//           >
//             <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//             </svg>
//             Back to Cart
//           </button>
//           <h1 className="text-3xl sm:text-4xl font-bold text-[#016B61] mb-2">Secure Checkout</h1>
//           <p className="text-[#016B61]/80">Complete your order in a few simple steps</p>
//         </div>

//         {/* Main Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
//           {/* Left: Payment Form */}
//           <div className="lg:col-span-2">
//             <PaymentForm 
//               cartItems={cartItems}
//               subtotal={subtotal}
//               shipping={shipping}
//               tax={tax}
//               total={total}
//             />
//           </div>

//           {/* Right: Order Summary */}
//           <div className="lg:col-span-1">
//             <OrderSummary
//               cartItems={cartItems}
//               subtotal={subtotal}
//               shipping={shipping}
//               tax={tax}
//               total={total}
//             />
//           </div>
//         </div>

//         {/* Security Notice */}
//         <div className="mt-8 bg-white/50 backdrop-blur-sm rounded-xl p-4 border-2 border-[#9ECFD4]/30 animate-fade-in">
//           <div className="flex items-start gap-3">
//             <div className="p-2 bg-[#016B61]/10 rounded-lg">
//               <svg className="w-6 h-6 text-[#016B61] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//               </svg>
//             </div>
//             <div>
//               <h3 className="font-semibold text-[#016B61] mb-1">🔒 Secure Checkout</h3>
//               <p className="text-sm text-[#016B61]/80">
//                 Your payment information is encrypted and secure. We never store your payment details.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes slide-down {
//           from { opacity: 0; transform: translateY(-20px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-slide-down {
//           animation: slide-down 0.5s ease-out;
//         }
//         @keyframes fade-in {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         .animate-fade-in {
//           animation: fade-in 0.5s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// }


// 2nd code
// 'use client';
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import PaymentForm from '../components/PaymentForm';
// import OrderSummary from '../components/OrderSummary';

// // Types
// interface CartItem {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
//   image: string;
// }

// export default function CheckoutPage() {
//   const router = useRouter();
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // Fetch cart items from localStorage/state management
//     const loadCartItems = () => {
//       try {
//         const savedCart = localStorage.getItem('cart');
//         if (savedCart) {
//           const items = JSON.parse(savedCart);
//           setCartItems(items);
//         } else {
//           // Redirect to cart if empty
//           router.push('/cart');
//         }
//       } catch (error) {
//         console.error('Error loading cart:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadCartItems();
//   }, [router]);

//   // Calculate totals
//   const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//   const shipping = subtotal > 0 ? 50 : 0; // Free shipping over certain amount
//   const tax = subtotal * 0.15; // 15% tax
//   const total = subtotal + shipping + tax;

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-[#9ECFD4] flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#016B61] border-t-transparent mx-auto mb-4"></div>
//           <p className="text-[#016B61] font-medium">Loading checkout...</p>
//         </div>
//       </div>
//     );
//   }

//   if (cartItems.length === 0) {
//     return (
//       <div className="min-h-screen bg-[#9ECFD4] flex items-center justify-center px-4">
//         <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
//           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Cart is Empty</h2>
//           <p className="text-gray-600 mb-6">Please add items to your cart before checkout.</p>
//           <button
//             onClick={() => router.push('/products')}
//             className="bg-[#016B61] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#014a43] transition-colors duration-300"
//           >
//             Continue Shopping
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#9ECFD4] via-[#78B9B5] to-[#016B61]/20 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <button
//             onClick={() => router.back()}
//             className="flex items-center gap-2 text-[#016B61] hover:text-[#78B9B5] font-medium transition-colors duration-300 mb-4"
//           >
//             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//             </svg>
//             Back to Cart
//           </button>
//           <h1 className="text-3xl sm:text-4xl font-bold text-[#016B61]">Checkout</h1>
//           <p className="text-[#016B61]/80 mt-2">Complete your order securely</p>
//         </div>

//         {/* Main Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
//           {/* Left: Payment Form */}
//           <div className="lg:col-span-2">
//             <PaymentForm 
//               cartItems={cartItems}
//               subtotal={subtotal}
//               shipping={shipping}
//               tax={tax}
//               total={total}
//             />
//           </div>

//           {/* Right: Order Summary */}
//           <div className="lg:col-span-1">
//             <OrderSummary
//               cartItems={cartItems}
//               subtotal={subtotal}
//               shipping={shipping}
//               tax={tax}
//               total={total}
//             />
//           </div>
//         </div>

//         {/* Security Notice */}
//         <div className="mt-8 bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-[#016B61]/20">
//           <div className="flex items-start gap-3">
//             <svg className="w-6 h-6 text-[#016B61] flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//             </svg>
//             <div>
//               <h3 className="font-semibold text-[#016B61] mb-1">Secure Checkout</h3>
//               <p className="text-sm text-[#016B61]/80">
//                 Your payment information is encrypted and secure. We never store your payment details.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// 1st code
// 'use client';
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import PaymentForm from '../components/PaymentForm';
// import OrderSummary from '../components/OrderSummary';

// // Types
// interface CartItem {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
//   image: string;
// }

// export default function CheckoutPage() {
//   const router = useRouter();
//   const [cartItems, setCartItems] = useState<CartItem[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // Fetch cart items from localStorage/state management
//     const loadCartItems = () => {
//       try {
//         const savedCart = localStorage.getItem('cart');
//         if (savedCart) {
//           const items = JSON.parse(savedCart);
//           setCartItems(items);
//         } else {
//           // Redirect to cart if empty
//           router.push('/cart');
//         }
//       } catch (error) {
//         console.error('Error loading cart:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadCartItems();
//   }, [router]);

//   // Calculate totals
//   const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//   const shipping = subtotal > 0 ? 50 : 0; // Free shipping over certain amount
//   const tax = subtotal * 0.15; // 15% tax
//   const total = subtotal + shipping + tax;

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-[#9ECFD4] flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#016B61] border-t-transparent mx-auto mb-4"></div>
//           <p className="text-[#016B61] font-medium">Loading checkout...</p>
//         </div>
//       </div>
//     );
//   }

//   if (cartItems.length === 0) {
//     return (
//       <div className="min-h-screen bg-[#9ECFD4] flex items-center justify-center px-4">
//         <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
//           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Cart is Empty</h2>
//           <p className="text-gray-600 mb-6">Please add items to your cart before checkout.</p>
//           <button
//             onClick={() => router.push('/products')}
//             className="bg-[#016B61] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#014a43] transition-colors duration-300"
//           >
//             Continue Shopping
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#9ECFD4] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <button
//             onClick={() => router.back()}
//             className="flex items-center gap-2 text-[#016B61] hover:text-black font-medium transition-colors duration-300 mb-4"
//           >
//             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//             </svg>
//             Back to Cart
//           </button>
//           <h1 className="text-3xl sm:text-4xl font-bold text-[#016B61]">Checkout</h1>
//           <p className="text-[#016B61]/80 mt-2">Complete your order securely</p>
//         </div>

//         {/* Main Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
//           {/* Left: Payment Form */}
//           <div className="lg:col-span-2">
//             <PaymentForm 
//               cartItems={cartItems}
//               subtotal={subtotal}
//               shipping={shipping}
//               tax={tax}
//               total={total}
//             />
//           </div>

//           {/* Right: Order Summary */}
//           <div className="lg:col-span-1">
//             <OrderSummary
//               cartItems={cartItems}
//               subtotal={subtotal}
//               shipping={shipping}
//               tax={tax}
//               total={total}
//             />
//           </div>
//         </div>

//         {/* Security Notice */}
//         <div className="mt-8 bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-[#016B61]/20">
//           <div className="flex items-start gap-3">
//             <svg className="w-6 h-6 text-[#016B61] flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//             </svg>
//             <div>
//               <h3 className="font-semibold text-[#016B61] mb-1">Secure Checkout</h3>
//               <p className="text-sm text-[#016B61]/80">
//                 Your payment information is encrypted and secure. We never store your payment details.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }