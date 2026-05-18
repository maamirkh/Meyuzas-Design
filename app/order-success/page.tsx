'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OrderSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#9ECFD4] via-[#78B9B5] to-[#016B61]/20 flex items-center justify-center p-4 py-12">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-[#9ECFD4]">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-[#9ECFD4] via-[#78B9B5] to-[#016B61] p-10 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce">
              <svg className="w-10 h-10 text-[#016B61]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Order Confirmed!</h1>
            <p className="text-white/90 text-lg font-medium">Thank you for shopping with Meyuza&apos;s Store</p>
          </div>

          <div className="p-8 sm:p-12">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-[#016B61] mb-4">Your order has been placed successfully.</h2>
              <p className="text-[#016B61]/70 text-lg">
                We have received your order and are getting it ready for shipment. 
                You will receive a confirmation message shortly.
              </p>
            </div>

            {/* Order Info Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              <div className="bg-[#9ECFD4]/10 p-6 rounded-2xl border border-[#9ECFD4]/30">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-[#016B61]/10 rounded-lg">
                    <svg className="w-5 h-5 text-[#016B61]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="font-bold text-[#016B61]">Processing Time</span>
                </div>
                <p className="text-[#016B61]/70 text-sm">Usually processed within 24-48 hours</p>
              </div>

              <div className="bg-[#78B9B5]/10 p-6 rounded-2xl border border-[#78B9B5]/30">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-[#016B61]/10 rounded-lg">
                    <svg className="w-5 h-5 text-[#016B61]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-bold text-[#016B61]">Safe Delivery</span>
                </div>
                <p className="text-[#016B61]/70 text-sm">Reliable shipping to your doorstep</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4">
              <Link
                href="/fetchProduct"
                className="w-full bg-gradient-to-r from-[#9ECFD4] via-[#78B9B5] to-[#016B61] hover:from-[#78B9B5] hover:via-[#016B61] hover:to-[#9ECFD4] text-black py-4 rounded-xl font-bold text-lg text-center shadow-xl transition-all duration-500 transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Continue Shopping
              </Link>
              
              <Link
                href="/"
                className="w-full border-2 border-[#9ECFD4] text-[#016B61] py-4 rounded-xl font-bold text-lg text-center hover:bg-[#9ECFD4]/10 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
        </div>

        {/* Support Footer */}
        <div className="mt-8 text-center animate-fade-in">
          <p className="text-[#016B61] font-medium mb-2">Need help with your order?</p>
          <div className="flex justify-center gap-6">
            <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer" className="text-[#016B61] hover:text-[#78B9B5] transition-colors flex items-center gap-2">
              <span className="font-bold">WhatsApp Support</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
