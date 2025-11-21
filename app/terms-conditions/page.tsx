import React from 'react';
import Link from 'next/link';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-[#9ECFD4] py-8 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-white bg-black/20 hover:bg-black/30 px-4 py-2 rounded-full transition-all duration-300 mb-6"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-3">Terms & Conditions</h1>
            <p className="text-gray-600">Last Updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Terms Content */}
        <div className="space-y-6">
          {/* Card 1 */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-[#9ECFD4] rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Introduction</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Welcome to our store! By browsing and purchasing from our website, you agree to these simple terms that make shopping easy and enjoyable.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-[#9ECFD4] rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">2</span>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Products & Orders</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              We work hard to keep our product listings accurate. All prices are in INR and items are subject to availability. We'll notify you if anything changes with your order.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-[#9ECFD4] rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">3</span>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Payments</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Your payments are processed securely through trusted partners. We accept all major payment methods to make checkout smooth and safe.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-[#9ECFD4] rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">4</span>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Shipping</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              We ship across India! Delivery times depend on your location. While we ensure prompt dispatch, shipping carrier delays are beyond our control.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-[#9ECFD4] rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">5</span>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Returns & Support</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Not happy with your purchase? Check our return policy for easy solutions. Need help? Our support team is here for you at support@yourstore.com
            </p>
          </div>

          {/* Summary Card */}
          <div className="bg-black/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-white/30">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-gray-700 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-700 font-medium">
                By shopping with us, you agree to these terms. We may update them to serve you better, and we'll always keep you informed.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link 
            href="/privacy" 
            className="bg-white/90 backdrop-blur-sm text-gray-800 px-6 py-3 rounded-full hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
          >
            Privacy Policy
          </Link>
          <Link 
            href="/returns" 
            className="bg-white/90 backdrop-blur-sm text-gray-800 px-6 py-3 rounded-full hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
          >
            Return Policy
          </Link>
          <Link 
            href="/contact" 
            className="bg-white/90 backdrop-blur-sm text-gray-800 px-6 py-3 rounded-full hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
          >
            Contact Us
          </Link>
        </div>

        {/* Bottom Note */}
        <div className="text-center mt-8">
          <p className="text-white/80 text-sm">
            Thank you for choosing us! ❤️
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;