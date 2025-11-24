'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OrderSuccessPage() {
  const router = useRouter();

  // ✅ CORRECT - Call inside useEffect
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 5000); // Redirect after 5 seconds

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#9ECFD4] via-[#78B9B5] to-[#016B61]/20 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border-2 border-[#9ECFD4]">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-gradient-to-br from-[#9ECFD4] to-[#78B9B5] rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-[#016B61] mb-4">
          Order Placed Successfully! 🎉
        </h1>
        <p className="text-[#016B61]/80 mb-6">
          Thank you for your order. We'll send you a confirmation email shortly.
        </p>

        {/* Order Details */}
        <div className="bg-[#9ECFD4]/10 rounded-xl p-4 mb-6">
          <p className="text-sm text-[#016B61] mb-2">
            You will be redirected to the homepage in 5 seconds...
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-[#78B9B5] to-[#016B61] h-2 rounded-full animate-progress"></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => router.push('/fetchProduct')}
            className="flex-1 bg-gradient-to-r from-[#9ECFD4] via-[#78B9B5] to-[#016B61] text-black px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => router.push('/')}
            className="flex-1 border-2 border-[#9ECFD4] text-[#016B61] px-6 py-3 rounded-lg font-semibold hover:bg-[#9ECFD4]/10 transition-all duration-300"
          >
            Go Home
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-progress {
          animation: progress 5s linear;
        }
      `}</style>
    </div>
  );
}


// 'use client';
// import { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';

// export default function OrderSuccessPage() {
//   const router = useRouter();
//   const [orderNumber] = useState(() => 
//     'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase()
//   );
//   const [countdown, setCountdown] = useState(10);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCountdown(prev => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           router.push('/');
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [router]);

//   return (
//     <div className="min-h-screen bg-[#9ECFD4] flex items-center justify-center px-4 py-12">
//       <div className="max-w-2xl w-full">
//         {/* Success Card */}
//         <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
//           {/* Success Icon */}
//           <div className="bg-gradient-to-br from-green-400 to-green-600 p-8 text-center">
//             <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
//               <svg className="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//               </svg>
//             </div>
//             <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Order Placed Successfully!</h1>
//             <p className="text-green-50 text-lg">Thank you for shopping with us</p>
//           </div>

//           {/* Order Details */}
//           <div className="p-6 sm:p-8">
//             <div className="bg-gray-50 rounded-xl p-6 mb-6">
//               <div className="flex items-center justify-between mb-4">
//                 <div>
//                   <p className="text-sm text-gray-600 mb-1">Order Number</p>
//                   <p className="text-xl font-bold text-[#016B61]">{orderNumber}</p>
//                 </div>
//                 <div className="w-16 h-16 bg-[#016B61]/10 rounded-full flex items-center justify-center">
//                   <svg className="w-8 h-8 text-[#016B61]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                   </svg>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <p className="text-sm text-gray-600 mb-1">Order Date</p>
//                   <p className="font-semibold text-gray-900">{new Date().toLocaleDateString('en-US', { 
//                     day: 'numeric',
//                     month: 'long',
//                     year: 'numeric'
//                   })}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600 mb-1">Estimated Delivery</p>
//                   <p className="font-semibold text-gray-900">
//                     {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
//                       day: 'numeric',
//                       month: 'long'
//                     })}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* What's Next */}
//             <div className="space-y-4 mb-8">
//               <h2 className="text-xl font-bold text-gray-900">What happens next?</h2>
              
//               <div className="flex gap-4">
//                 <div className="flex-shrink-0">
//                   <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//                     <span className="text-blue-600 font-bold">1</span>
//                   </div>
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-gray-900 mb-1">Order Confirmation</h3>
//                   <p className="text-sm text-gray-600">You'll receive an email confirmation shortly with your order details.</p>
//                 </div>
//               </div>

//               <div className="flex gap-4">
//                 <div className="flex-shrink-0">
//                   <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
//                     <span className="text-purple-600 font-bold">2</span>
//                   </div>
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-gray-900 mb-1">Order Processing</h3>
//                   <p className="text-sm text-gray-600">We'll prepare your items for shipment within 24-48 hours.</p>
//                 </div>
//               </div>

//               <div className="flex gap-4">
//                 <div className="flex-shrink-0">
//                   <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
//                     <span className="text-green-600 font-bold">3</span>
//                   </div>
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-gray-900 mb-1">Out for Delivery</h3>
//                   <p className="text-sm text-gray-600">Your order will be delivered to your doorstep within 3-5 business days.</p>
//                 </div>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex flex-col sm:flex-row gap-3 mb-6">
//               <Link
//                 href="/"
//                 className="flex-1 bg-[#016B61] text-white py-3 px-6 rounded-lg font-semibold text-center hover:bg-[#014a43] transition-colors duration-300"
//               >
//                 Continue Shopping
//               </Link>
//               <Link
//                 href="/orders"
//                 className="flex-1 border-2 border-[#016B61] text-[#016B61] py-3 px-6 rounded-lg font-semibold text-center hover:bg-[#016B61] hover:text-white transition-all duration-300"
//               >
//                 View Orders
//               </Link>
//             </div>

//             {/* Redirect Notice */}
//             <div className="text-center">
//               <p className="text-sm text-gray-600">
//                 Redirecting to homepage in <span className="font-bold text-[#016B61]">{countdown}</span> seconds...
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Support Info */}
//         <div className="mt-6 bg-white/50 backdrop-blur-sm rounded-xl p-6 text-center">
//           <h3 className="font-semibold text-[#016B61] mb-2">Need Help?</h3>
//           <p className="text-sm text-[#016B61]/80 mb-3">
//             Our customer support team is here to assist you
//           </p>
//           <div className="flex justify-center gap-4">
//             <a href="tel:+923001234567" className="text-sm text-[#016B61] hover:underline font-medium">
//               📞 +92 300 1234567
//             </a>
//             <a href="mailto:support@meyuzas.com" className="text-sm text-[#016B61] hover:underline font-medium">
//               ✉️ support@meyuzas.com
//             </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }