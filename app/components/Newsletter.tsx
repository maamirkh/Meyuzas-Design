'use client';
import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setMessage('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setMessage('Thank you for subscribing!');
      setEmail('');
      setIsSubmitting(false);
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    }, 1000);
  };

  return (
    <section className="bg-[#9ECFD4] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-black text-white py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8 rounded-2xl shadow-2xl">
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6 lg:gap-12">
            
            {/* Left Side - Text Content */}
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold mb-2 sm:mb-3 leading-tight">
                STAY UP TO DATE ABOUT
                <br className="hidden sm:block" />
                OUR LATEST OFFERS
              </h2>
              <p className="text-gray-300 text-sm sm:text-base max-w-md mx-auto lg:mx-0">
                Subscribe to get special offers, free giveaways, and exclusive deals.
              </p>
            </div>

            {/* Right Side - Email Form */}
            <div className="flex-1 w-full max-w-md">
              <form onSubmit={handleSubmit} className="space-y-3">
                
                {/* Email Input */}
                <div className="relative">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg 
                      className="h-4 w-4 text-gray-400" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    id="newsletter-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-10 pr-4 py-3 bg-gray-100 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 placeholder-gray-500 text-sm transition-all duration-300"
                    required
                    disabled={isSubmitting}
                    aria-label="Email address for newsletter"
                  />
                </div>
                
                {/* Subscribe Button */}
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white text-black px-6 py-3 rounded-xl font-semibold text-sm hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  aria-label="Subscribe to newsletter"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Subscribing...
                    </span>
                  ) : (
                    'Subscribe to Newsletter'
                  )}
                </button>

                {/* Success/Error Message */}
                {message && (
                  <div 
                    className={`text-sm text-center py-2 px-4 rounded-lg transition-all duration-300 ${
                      message.includes('Thank you') 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}
                    role="alert"
                    aria-live="polite"
                  >
                    {message}
                  </div>
                )}
              </form>

              {/* Privacy Notice */}
              <p className="text-xs text-gray-400 mt-3 text-center">
                By subscribing, you agree to our Privacy Policy and consent to receive updates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}