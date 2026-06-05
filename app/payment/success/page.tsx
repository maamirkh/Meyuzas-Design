'use client';
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { clearCart } from '../../../actions/actions';
import { useCart } from '../../context/CartContext';

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updateCartCount } = useCart();
  const basketId = searchParams.get('basket_id');

  useEffect(() => {
    // Clear the cart on successful payment
    clearCart();
    updateCartCount();
    
    // Redirect to the unified order success page with orderId
    const timer = setTimeout(() => {
      router.push(`/order-success${basketId ? `?orderId=${basketId}` : ''}`);
    }, 2000);

    return () => clearTimeout(timer);
  }, [router, updateCartCount, basketId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#9ECFD4] via-[#78B9B5] to-[#016B61]/20 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border-2 border-[#9ECFD4]">
        <div className="w-20 h-20 bg-gradient-to-br from-[#9ECFD4] to-[#78B9B5] rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-[#016B61] mb-4">Payment Successful!</h1>
        <p className="text-[#016B61]/80 mb-6">
          Your payment has been processed successfully. Redirecting you to the order details...
        </p>
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#78B9B5] border-t-transparent mx-auto"></div>
      </div>
    </div>
  );
}

export default function PaymentSuccess() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#78B9B5] border-t-transparent"></div>
            </div>
        }>
            <PaymentSuccessContent />
        </Suspense>
    );
}
