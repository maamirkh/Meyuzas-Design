'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface PaymentFormProps {
  cartItems: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  onOrderComplete: () => void; // ✅ Added callback prop
}

type PaymentMethod = 'easypaisa' | 'jazzcash' | 'cod';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  paymentMethod: PaymentMethod;
  accountNumber: string;
  transactionId: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function PaymentForm({ 
  cartItems, 
  subtotal, 
  shipping, 
  tax, 
  total,
  onOrderComplete // ✅ Receive callback
}: PaymentFormProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    paymentMethod: 'cod',
    accountNumber: '',
    transactionId: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const sanitizeInput = (value: string): string => {
    return value.replace(/[<>]/g, '').trim();
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^(\+92|0)?3[0-9]{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validateAccountNumber = (number: string): boolean => {
    const numberRegex = /^03[0-9]{9}$/;
    return numberRegex.test(number.replace(/\s/g, ''));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName || formData.fullName.length < 3) {
      newErrors.fullName = 'Full name must be at least 3 characters';
    }

    if (!formData.email || !validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone || !validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid Pakistani phone number (03XXXXXXXXX)';
    }

    if (!formData.address || formData.address.length < 10) {
      newErrors.address = 'Please enter a complete address (min 10 characters)';
    }

    if (!formData.city || formData.city.length < 3) {
      newErrors.city = 'Please enter a valid city name';
    }

    if (!formData.province) {
      newErrors.province = 'Please select a province';
    }

    if (!formData.postalCode || formData.postalCode.length < 5) {
      newErrors.postalCode = 'Please enter a valid postal code';
    }

    if (formData.paymentMethod === 'easypaisa' || formData.paymentMethod === 'jazzcash') {
      if (!formData.accountNumber || !validateAccountNumber(formData.accountNumber)) {
        newErrors.accountNumber = 'Please enter a valid account number (03XXXXXXXXX)';
      }

      if (!formData.transactionId || formData.transactionId.length < 10) {
        newErrors.transactionId = 'Please enter a valid transaction ID';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstError = document.querySelector('.error-message');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        customer: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone
        },
        shipping: {
          address: formData.address,
          city: formData.city,
          province: formData.province,
          postalCode: formData.postalCode
        },
        payment: {
          method: formData.paymentMethod,
          accountNumber: formData.accountNumber,
          transactionId: formData.transactionId
        },
        items: cartItems,
        pricing: {
          subtotal,
          shipping,
          tax,
          total
        },
        timestamp: new Date().toISOString()
      };

      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Order placed:', orderData);

      // ✅ Call the callback to clear cart and update counter
      onOrderComplete();

      setShowSuccess(true);

      setTimeout(() => {
        router.push('/order-success');
      }, 2000);

    } catch (error) {
      console.error('Payment error:', error);
      setErrors({ submit: 'Payment failed. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border-2 border-[#9ECFD4] animate-scale-in">
          <div className="w-20 h-20 bg-gradient-to-br from-[#9ECFD4] to-[#78B9B5] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#016B61] mb-2">Order Placed Successfully!</h2>
          <p className="text-[#016B61]/70 mb-4">Your order has been confirmed. Redirecting...</p>
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#78B9B5] border-t-transparent mx-auto"></div>
        </div>
      </div>
    );
  }

  const provinces = [
    'Punjab',
    'Sindh',
    'Khyber Pakhtunkhwa',
    'Balochistan',
    'Gilgit-Baltistan',
    'Azad Kashmir'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#9ECFD4]/30 hover:border-[#78B9B5]/50 transition-colors duration-300">
        <h2 className="text-xl font-bold text-[#016B61] mb-4 flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-[#9ECFD4]/20 to-[#78B9B5]/20 rounded-lg">
            <svg className="w-6 h-6 text-[#016B61]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          Personal Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-semibold text-[#016B61] mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78B9B5] focus:border-[#78B9B5] transition-all ${
                errors.fullName ? 'border-red-500' : 'border-[#9ECFD4]/30'
              }`}
              placeholder="John Doe"
              required
            />
            {errors.fullName && (
              <p className="error-message text-red-600 text-sm mt-1">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-[#016B61] mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78B9B5] focus:border-[#78B9B5] transition-all ${
                errors.email ? 'border-red-500' : 'border-[#9ECFD4]/30'
              }`}
              placeholder="john@example.com"
              required
            />
            {errors.email && (
              <p className="error-message text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="phone" className="block text-sm font-semibold text-[#016B61] mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78B9B5] focus:border-[#78B9B5] transition-all ${
                errors.phone ? 'border-red-500' : 'border-[#9ECFD4]/30'
              }`}
              placeholder="03001234567"
              required
            />
            {errors.phone && (
              <p className="error-message text-red-600 text-sm mt-1">{errors.phone}</p>
            )}
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#9ECFD4]/30 hover:border-[#78B9B5]/50 transition-colors duration-300">
        <h2 className="text-xl font-bold text-[#016B61] mb-4 flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-[#9ECFD4]/20 to-[#78B9B5]/20 rounded-lg">
            <svg className="w-6 h-6 text-[#016B61]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          Shipping Address
        </h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="address" className="block text-sm font-semibold text-[#016B61] mb-2">
              Complete Address *
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows={3}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78B9B5] focus:border-[#78B9B5] transition-all resize-none ${
                errors.address ? 'border-red-500' : 'border-[#9ECFD4]/30'
              }`}
              placeholder="House/Flat No., Street, Area"
              required
            />
            {errors.address && (
              <p className="error-message text-red-600 text-sm mt-1">{errors.address}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-semibold text-[#016B61] mb-2">
                City *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78B9B5] focus:border-[#78B9B5] transition-all ${
                  errors.city ? 'border-red-500' : 'border-[#9ECFD4]/30'
                }`}
                placeholder="Karachi"
                required
              />
              {errors.city && (
                <p className="error-message text-red-600 text-sm mt-1">{errors.city}</p>
              )}
            </div>

            <div>
              <label htmlFor="province" className="block text-sm font-semibold text-[#016B61] mb-2">
                Province *
              </label>
              <select
                id="province"
                name="province"
                value={formData.province}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78B9B5] focus:border-[#78B9B5] transition-all ${
                  errors.province ? 'border-red-500' : 'border-[#9ECFD4]/30'
                }`}
                required
              >
                <option value="">Select Province</option>
                {provinces.map(province => (
                  <option key={province} value={province}>{province}</option>
                ))}
              </select>
              {errors.province && (
                <p className="error-message text-red-600 text-sm mt-1">{errors.province}</p>
              )}
            </div>

            <div>
              <label htmlFor="postalCode" className="block text-sm font-semibold text-[#016B61] mb-2">
                Postal Code *
              </label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78B9B5] focus:border-[#78B9B5] transition-all ${
                  errors.postalCode ? 'border-red-500' : 'border-[#9ECFD4]/30'
                }`}
                placeholder="75500"
                required
              />
              {errors.postalCode && (
                <p className="error-message text-red-600 text-sm mt-1">{errors.postalCode}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#9ECFD4]/30 hover:border-[#78B9B5]/50 transition-colors duration-300">
        <h2 className="text-xl font-bold text-[#016B61] mb-4 flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-[#9ECFD4]/20 to-[#78B9B5]/20 rounded-lg">
            <svg className="w-6 h-6 text-[#016B61]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          Payment Method
        </h2>

        <div className="space-y-3">
          {/* Easypaisa */}
          <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
            formData.paymentMethod === 'easypaisa' 
              ? 'border-[#7AC143] bg-green-50 shadow-md' 
              : 'border-[#9ECFD4]/30 hover:border-[#7AC143]/50'
          }`}>
            <input
              type="radio"
              name="paymentMethod"
              value="easypaisa"
              checked={formData.paymentMethod === 'easypaisa'}
              onChange={handleInputChange}
              className="w-5 h-5 text-[#7AC143] focus:ring-[#7AC143]"
            />
            <div className="ml-3 flex items-center gap-3 flex-1">
              <div className="w-12 h-8 bg-[#7AC143] rounded flex items-center justify-center shadow-sm">
                <span className="text-white text-xs font-bold">EP</span>
              </div>
              <div>
                <div className="font-semibold text-[#016B61]">Easypaisa</div>
                <div className="text-sm text-[#016B61]/70">Pay via Easypaisa account</div>
              </div>
            </div>
          </label>

          {/* JazzCash */}
          <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
            formData.paymentMethod === 'jazzcash' 
              ? 'border-[#DC0000] bg-red-50 shadow-md' 
              : 'border-[#9ECFD4]/30 hover:border-[#DC0000]/50'
          }`}>
            <input
              type="radio"
              name="paymentMethod"
              value="jazzcash"
              checked={formData.paymentMethod === 'jazzcash'}
              onChange={handleInputChange}
              className="w-5 h-5 text-[#DC0000] focus:ring-[#DC0000]"
            />
            <div className="ml-3 flex items-center gap-3 flex-1">
              <div className="w-12 h-8 bg-[#DC0000] rounded flex items-center justify-center shadow-sm">
                <span className="text-white text-xs font-bold">JC</span>
              </div>
              <div>
                <div className="font-semibold text-[#016B61]">JazzCash</div>
                <div className="text-sm text-[#016B61]/70">Pay via JazzCash account</div>
              </div>
            </div>
          </label>

          {/* Cash on Delivery */}
          <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
            formData.paymentMethod === 'cod' 
              ? 'border-[#016B61] bg-[#9ECFD4]/10 shadow-md' 
              : 'border-[#9ECFD4]/30 hover:border-[#016B61]/50'
          }`}>
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={formData.paymentMethod === 'cod'}
              onChange={handleInputChange}
              className="w-5 h-5 text-[#016B61] focus:ring-[#016B61]"
            />
            <div className="ml-3 flex items-center gap-3 flex-1">
              <div className="w-12 h-8 bg-gradient-to-br from-[#78B9B5] to-[#016B61] rounded flex items-center justify-center shadow-sm">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-[#016B61]">Cash on Delivery</div>
                <div className="text-sm text-[#016B61]/70">Pay when you receive</div>
              </div>
            </div>
          </label>
        </div>

        {/* Payment Details for Easypaisa/JazzCash */}
        {(formData.paymentMethod === 'easypaisa' || formData.paymentMethod === 'jazzcash') && (
          <div className="mt-6 p-4 bg-gradient-to-br from-[#9ECFD4]/10 to-[#78B9B5]/10 rounded-lg space-y-4 border-2 border-[#9ECFD4]/30">
            <div className="flex items-start gap-2 text-sm text-[#016B61] bg-white p-3 rounded-lg shadow-sm">
              <svg className="w-5 h-5 text-[#016B61] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>
                <strong>Instructions:</strong> Please transfer Rs. {total.toFixed(2)} to our {formData.paymentMethod === 'easypaisa' ? 'Easypaisa' : 'JazzCash'} account <strong className="text-[#78B9B5]">03001234567</strong> and enter the details below.
              </p>
            </div>

            <div>
              <label htmlFor="accountNumber" className="block text-sm font-semibold text-[#016B61] mb-2">
                Your {formData.paymentMethod === 'easypaisa' ? 'Easypaisa' : 'JazzCash'} Account Number *
              </label>
              <input
                type="tel"
                id="accountNumber"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78B9B5] focus:border-[#78B9B5] transition-all ${
                  errors.accountNumber ? 'border-red-500' : 'border-[#9ECFD4]/30'
                }`}
                placeholder="03001234567"
                required
              />
              {errors.accountNumber && (
                <p className="error-message text-red-600 text-sm mt-1">{errors.accountNumber}</p>
              )}
            </div>

            <div>
              <label htmlFor="transactionId" className="block text-sm font-semibold text-[#016B61] mb-2">
                Transaction ID *
              </label>
              <input
                type="text"
                id="transactionId"
                name="transactionId"
                value={formData.transactionId}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78B9B5] focus:border-[#78B9B5] transition-all ${
                  errors.transactionId ? 'border-red-500' : 'border-[#9ECFD4]/30'
                }`}
                placeholder="Enter transaction ID"
                required
              />
              {errors.transactionId && (
                <p className="error-message text-red-600 text-sm mt-1">{errors.transactionId}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-medium">{errors.submit}</p>
          </div>
        </div>
      )}

      {/* Submit Button - Gradient with Black Text */}
      <button
        type="submit"
        disabled={isProcessing}
        className="w-full bg-gradient-to-r from-[#9ECFD4] via-[#78B9B5] to-[#016B61] hover:from-[#78B9B5] hover:via-[#016B61] hover:to-[#9ECFD4] text-black py-5 rounded-xl font-black text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 shadow-2xl hover:shadow-3xl"
      >
        {isProcessing ? (
          <>
            <svg className="animate-spin h-6 w-6 text-black" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing Payment...
          </>
        ) : (
          <>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Place Order - Rs. {total.toFixed(2)}
          </>
        )}
      </button>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </form>
  );
}

// 'use client';
// import { useState, FormEvent } from 'react';
// import { useRouter } from 'next/navigation';

// interface CartItem {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
//   image: string;
// }

// interface PaymentFormProps {
//   cartItems: CartItem[];
//   subtotal: number;
//   shipping: number;
//   tax: number;
//   total: number;
// }

// type PaymentMethod = 'easypaisa' | 'jazzcash' | 'cod';

// interface FormData {
//   fullName: string;
//   email: string;
//   phone: string;
//   address: string;
//   city: string;
//   province: string;
//   postalCode: string;
//   paymentMethod: PaymentMethod;
//   accountNumber: string;
//   transactionId: string;
// }

// interface FormErrors {
//   [key: string]: string;
// }

// export default function PaymentForm({ cartItems, subtotal, shipping, tax, total }: PaymentFormProps) {
//   const router = useRouter();
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [formData, setFormData] = useState<FormData>({
//     fullName: '',
//     email: '',
//     phone: '',
//     address: '',
//     city: '',
//     province: '',
//     postalCode: '',
//     paymentMethod: 'cod',
//     accountNumber: '',
//     transactionId: ''
//   });
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [showSuccess, setShowSuccess] = useState(false);

//   const sanitizeInput = (value: string): string => {
//     return value.replace(/[<>]/g, '').trim();
//   };

//   const validateEmail = (email: string): boolean => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   const validatePhone = (phone: string): boolean => {
//     const phoneRegex = /^(\+92|0)?3[0-9]{9}$/;
//     return phoneRegex.test(phone.replace(/\s/g, ''));
//   };

//   const validateAccountNumber = (number: string): boolean => {
//     const numberRegex = /^03[0-9]{9}$/;
//     return numberRegex.test(number.replace(/\s/g, ''));
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     const sanitizedValue = sanitizeInput(value);
    
//     setFormData(prev => ({
//       ...prev,
//       [name]: sanitizedValue
//     }));
    
//     if (errors[name]) {
//       setErrors(prev => {
//         const newErrors = { ...prev };
//         delete newErrors[name];
//         return newErrors;
//       });
//     }
//   };

//   const validateForm = (): boolean => {
//     const newErrors: FormErrors = {};

//     if (!formData.fullName || formData.fullName.length < 3) {
//       newErrors.fullName = 'Full name must be at least 3 characters';
//     }

//     if (!formData.email || !validateEmail(formData.email)) {
//       newErrors.email = 'Please enter a valid email address';
//     }

//     if (!formData.phone || !validatePhone(formData.phone)) {
//       newErrors.phone = 'Please enter a valid Pakistani phone number (03XXXXXXXXX)';
//     }

//     if (!formData.address || formData.address.length < 10) {
//       newErrors.address = 'Please enter a complete address (min 10 characters)';
//     }

//     if (!formData.city || formData.city.length < 3) {
//       newErrors.city = 'Please enter a valid city name';
//     }

//     if (!formData.province) {
//       newErrors.province = 'Please select a province';
//     }

//     if (!formData.postalCode || formData.postalCode.length < 5) {
//       newErrors.postalCode = 'Please enter a valid postal code';
//     }

//     if (formData.paymentMethod === 'easypaisa' || formData.paymentMethod === 'jazzcash') {
//       if (!formData.accountNumber || !validateAccountNumber(formData.accountNumber)) {
//         newErrors.accountNumber = 'Please enter a valid account number (03XXXXXXXXX)';
//       }

//       if (!formData.transactionId || formData.transactionId.length < 10) {
//         newErrors.transactionId = 'Please enter a valid transaction ID';
//       }
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       const firstError = document.querySelector('.error-message');
//       firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
//       return;
//     }

//     setIsProcessing(true);

//     try {
//       const orderData = {
//         customer: {
//           fullName: formData.fullName,
//           email: formData.email,
//           phone: formData.phone
//         },
//         shipping: {
//           address: formData.address,
//           city: formData.city,
//           province: formData.province,
//           postalCode: formData.postalCode
//         },
//         payment: {
//           method: formData.paymentMethod,
//           accountNumber: formData.accountNumber,
//           transactionId: formData.transactionId
//         },
//         items: cartItems,
//         pricing: {
//           subtotal,
//           shipping,
//           tax,
//           total
//         },
//         timestamp: new Date().toISOString()
//       };

//       await new Promise(resolve => setTimeout(resolve, 2000));

//       console.log('Order placed:', orderData);

//       localStorage.removeItem('cart');

//       setShowSuccess(true);

//       setTimeout(() => {
//         router.push('/order-success');
//       }, 2000);

//     } catch (error) {
//       console.error('Payment error:', error);
//       setErrors({ submit: 'Payment failed. Please try again.' });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   if (showSuccess) {
//     return (
//       <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
//         <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border-2 border-[#9ECFD4] animate-scale-in">
//           <div className="w-20 h-20 bg-gradient-to-br from-[#9ECFD4] to-[#78B9B5] rounded-full flex items-center justify-center mx-auto mb-6">
//             <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//             </svg>
//           </div>
//           <h2 className="text-2xl font-bold text-[#016B61] mb-2">Order Placed Successfully!</h2>
//           <p className="text-[#016B61]/70 mb-4">Your order has been confirmed. Redirecting...</p>
//           <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#78B9B5] border-t-transparent mx-auto"></div>
//         </div>
//       </div>
//     );
//   }

//   const provinces = [
//     'Punjab',
//     'Sindh',
//     'Khyber Pakhtunkhwa',
//     'Balochistan',
//     'Gilgit-Baltistan',
//     'Azad Kashmir'
//   ];

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       {/* Personal Information */}
//       <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#9ECFD4]/30 hover:border-[#78B9B5]/50 transition-colors duration-300">
//         <h2 className="text-xl font-bold text-[#016B61] mb-4 flex items-center gap-2">
//           <div className="p-2 bg-gradient-to-br from-[#9ECFD4]/20 to-[#78B9B5]/20 rounded-lg">
//             <svg className="w-6 h-6 text-[#016B61]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//             </svg>
//           </div>
//           Personal Information
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label htmlFor="fullName" className="block text-sm font-semibold text-[#016B61] mb-2">
//               Full Name *
//             </label>
//             <input
//               type="text"
//               id="fullName"
//               name="fullName"
//               value={formData.fullName}
//               onChange={handleInputChange}
//               className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78B9B5] focus:border-[#78B9B5] transition-all ${
//                 errors.fullName ? 'border-red-500' : 'border-[#9ECFD4]/30'
//               }`}
//               placeholder="John Doe"
//               required
//             />
//             {errors.fullName && (
//               <p className="error-message text-red-600 text-sm mt-1">{errors.fullName}</p>
//             )}
//           </div>

//           <div>
//             <label htmlFor="email" className="block text-sm font-semibold text-[#016B61] mb-2">
//               Email Address *
//             </label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleInputChange}
//               className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78B9B5] focus:border-[#78B9B5] transition-all ${
//                 errors.email ? 'border-red-500' : 'border-[#9ECFD4]/30'
//               }`}
//               placeholder="john@example.com"
//               required
//             />
//             {errors.email && (
//               <p className="error-message text-red-600 text-sm mt-1">{errors.email}</p>
//             )}
//           </div>

//           <div className="md:col-span-2">
//             <label htmlFor="phone" className="block text-sm font-semibold text-[#016B61] mb-2">
//               Phone Number *
//             </label>
//             <input
//               type="tel"
//               id="phone"
//               name="phone"
//               value={formData.phone}
//               onChange={handleInputChange}
//               className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78B9B5] focus:border-[#78B9B5] transition-all ${
//                 errors.phone ? 'border-red-500' : 'border-[#9ECFD4]/30'
//               }`}
//               placeholder="03001234567"
//               required
//             />
//             {errors.phone && (
//               <p className="error-message text-red-600 text-sm mt-1">{errors.phone}</p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Shipping Address */}
//       <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#9ECFD4]/30 hover:border-[#78B9B5]/50 transition-colors duration-300">
//         <h2 className="text-xl font-bold text-[#016B61] mb-4 flex items-center gap-2">
//           <div className="p-2 bg-gradient-to-br from-[#9ECFD4]/20 to-[#78B9B5]/20 rounded-lg">
//             <svg className="w-6 h-6 text-[#016B61]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//             </svg>
//           </div>
//           Shipping Address
//         </h2>

//         <div className="space-y-4">
//           <div>
//             <label htmlFor="address" className="block text-sm font-semibold text-[#016B61] mb-2">
//               Complete Address *
//             </label>
//             <textarea
//               id="address"
//               name="address"
//               value={formData.address}
//               onChange={handleInputChange}
//               rows={3}
//               className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78B9B5] focus:border-[#78B9B5] transition-all resize-none ${
//                 errors.address ? 'border-red-500' : 'border-[#9ECFD4]/30'
//               }`}
//               placeholder="House/Flat No., Street, Area"
//               required
//             />
//             {errors.address && (
//               <p className="error-message text-red-600 text-sm mt-1">{errors.address}</p>
//             )}
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label htmlFor="city" className="block text-sm font-semibold text-[#016B61] mb-2">
//                 City *
//               </label>
//               <input
//                 type="text"
//                 id="city"
//                 name="city"
//                 value={formData.city}
//                 onChange={handleInputChange}
//                 className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78B9B5] focus:border-[#78B9B5] transition-all ${
//                   errors.city ? 'border-red-500' : 'border-[#9ECFD4]/30'
//                 }`}
//                 placeholder="Karachi"
//                 required
//               />
//               {errors.city && (
//                 <p className="error-message text-red-600 text-sm mt-1">{errors.city}</p>
//               )}
//             </div>

//             <div>
//               <label htmlFor="province" className="block text-sm font-semibold text-[#016B61] mb-2">
//                 Province *
//               </label>
//               <select
//                 id="province"
//                 name="province"
//                 value={formData.province}
//                 onChange={handleInputChange}
//                 className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78B9B5] focus:border-[#78B9B5] transition-all ${
//                   errors.province ? 'border-red-500' : 'border-[#9ECFD4]/30'
//                 }`}
//                 required
//               >
//                 <option value="">Select Province</option>
//                 {provinces.map(province => (
//                   <option key={province} value={province}>{province}</option>
//                 ))}
//               </select>
//               {errors.province && (
//                 <p className="error-message text-red-600 text-sm mt-1">{errors.province}</p>
//               )}
//             </div>

//             <div>
//               <label htmlFor="postalCode" className="block text-sm font-semibold text-[#016B61] mb-2">
//                 Postal Code *
//               </label>
//               <input
//                 type="text"
//                 id="postalCode"
//                 name="postalCode"
//                 value={formData.postalCode}
//                 onChange={handleInputChange}
//                 className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78B9B5] focus:border-[#78B9B5] transition-all ${
//                   errors.postalCode ? 'border-red-500' : 'border-[#9ECFD4]/30'
//                 }`}
//                 placeholder="75500"
//                 required
//               />
//               {errors.postalCode && (
//                 <p className="error-message text-red-600 text-sm mt-1">{errors.postalCode}</p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Payment Method */}
//       <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-[#9ECFD4]/30 hover:border-[#78B9B5]/50 transition-colors duration-300">
//         <h2 className="text-xl font-bold text-[#016B61] mb-4 flex items-center gap-2">
//           <div className="p-2 bg-gradient-to-br from-[#9ECFD4]/20 to-[#78B9B5]/20 rounded-lg">
//             <svg className="w-6 h-6 text-[#016B61]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
//             </svg>
//           </div>
//           Payment Method
//         </h2>

//         <div className="space-y-3">
//           {/* Easypaisa */}
//           <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
//             formData.paymentMethod === 'easypaisa' 
//               ? 'border-[#7AC143] bg-green-50 shadow-md' 
//               : 'border-[#9ECFD4]/30 hover:border-[#7AC143]/50'
//           }`}>
//             <input
//               type="radio"
//               name="paymentMethod"
//               value="easypaisa"
//               checked={formData.paymentMethod === 'easypaisa'}
//               onChange={handleInputChange}
//               className="w-5 h-5 text-[#7AC143] focus:ring-[#7AC143]"
//             />
//             <div className="ml-3 flex items-center gap-3 flex-1">
//               <div className="w-12 h-8 bg-[#7AC143] rounded flex items-center justify-center shadow-sm">
//                 <span className="text-white text-xs font-bold">EP</span>
//               </div>
//               <div>
//                 <div className="font-semibold text-[#016B61]">Easypaisa</div>
//                 <div className="text-sm text-[#016B61]/70">Pay via Easypaisa account</div>
//               </div>
//             </div>
//           </label>

//           {/* JazzCash */}
//           <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
//             formData.paymentMethod === 'jazzcash' 
//               ? 'border-[#DC0000] bg-red-50 shadow-md' 
//               : 'border-[#9ECFD4]/30 hover:border-[#DC0000]/50'
//           }`}>
//             <input
//               type="radio"
//               name="paymentMethod"
//               value="jazzcash"
//               checked={formData.paymentMethod === 'jazzcash'}
//               onChange={handleInputChange}
//               className="w-5 h-5 text-[#DC0000] focus:ring-[#DC0000]"
//             />
//             <div className="ml-3 flex items-center gap-3 flex-1">
//               <div className="w-12 h-8 bg-[#DC0000] rounded flex items-center justify-center shadow-sm">
//                 <span className="text-white text-xs font-bold">JC</span>
//               </div>
//               <div>
//                 <div className="font-semibold text-[#016B61]">JazzCash</div>
//                 <div className="text-sm text-[#016B61]/70">Pay via JazzCash account</div>
//               </div>
//             </div>
//           </label>

//           {/* Cash on Delivery */}
//           <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
//             formData.paymentMethod === 'cod' 
//               ? 'border-[#016B61] bg-[#9ECFD4]/10 shadow-md' 
//               : 'border-[#9ECFD4]/30 hover:border-[#016B61]/50'
//           }`}>
//             <input
//               type="radio"
//               name="paymentMethod"
//               value="cod"
//               checked={formData.paymentMethod === 'cod'}
//               onChange={handleInputChange}
//               className="w-5 h-5 text-[#016B61] focus:ring-[#016B61]"
//             />
//             <div className="ml-3 flex items-center gap-3 flex-1">
//               <div className="w-12 h-8 bg-gradient-to-br from-[#78B9B5] to-[#016B61] rounded flex items-center justify-center shadow-sm">
//                 <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
//                 </svg>
//               </div>
//               <div>
//                 <div className="font-semibold text-[#016B61]">Cash on Delivery</div>
//                 <div className="text-sm text-[#016B61]/70">Pay when you receive</div>
//               </div>
//             </div>
//           </label>
//         </div>

//         {/* Payment Details for Easypaisa/JazzCash */}
//         {(formData.paymentMethod === 'easypaisa' || formData.paymentMethod === 'jazzcash') && (
//           <div className="mt-6 p-4 bg-gradient-to-br from-[#9ECFD4]/10 to-[#78B9B5]/10 rounded-lg space-y-4 border-2 border-[#9ECFD4]/30">
//             <div className="flex items-start gap-2 text-sm text-[#016B61] bg-white p-3 rounded-lg shadow-sm">
//               <svg className="w-5 h-5 text-[#016B61] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <p>
//                 <strong>Instructions:</strong> Please transfer Rs. {total.toFixed(2)} to our {formData.paymentMethod === 'easypaisa' ? 'Easypaisa' : 'JazzCash'} account <strong className="text-[#78B9B5]">03001234567</strong> and enter the details below.
//               </p>
//             </div>

//             <div>
//               <label htmlFor="accountNumber" className="block text-sm font-semibold text-[#016B61] mb-2">
//                 Your {formData.paymentMethod === 'easypaisa' ? 'Easypaisa' : 'JazzCash'} Account Number *
//               </label>
//               <input
//                 type="tel"
//                 id="accountNumber"
//                 name="accountNumber"
//                 value={formData.accountNumber}
//                 onChange={handleInputChange}
//                 className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78B9B5] focus:border-[#78B9B5] transition-all ${
//                   errors.accountNumber ? 'border-red-500' : 'border-[#9ECFD4]/30'
//                 }`}
//                 placeholder="03001234567"
//                 required
//               />
//               {errors.accountNumber && (
//                 <p className="error-message text-red-600 text-sm mt-1">{errors.accountNumber}</p>
//               )}
//             </div>

//             <div>
//               <label htmlFor="transactionId" className="block text-sm font-semibold text-[#016B61] mb-2">
//                 Transaction ID *
//               </label>
//               <input
//                 type="text"
//                 id="transactionId"
//                 name="transactionId"
//                 value={formData.transactionId}
//                 onChange={handleInputChange}
//                 className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#78B9B5] focus:border-[#78B9B5] transition-all ${
//                   errors.transactionId ? 'border-red-500' : 'border-[#9ECFD4]/30'
//                 }`}
//                 placeholder="Enter transaction ID"
//                 required
//               />
//               {errors.transactionId && (
//                 <p className="error-message text-red-600 text-sm mt-1">{errors.transactionId}</p>
//               )}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Submit Error */}
//       {errors.submit && (
//         <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
//           <div className="flex items-center gap-2 text-red-800">
//             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//             <p className="font-medium">{errors.submit}</p>
//           </div>
//         </div>
//       )}

//       {/* Submit Button - Gradient with Black Text */}
//       <button
//         type="submit"
//         disabled={isProcessing}
//         className="w-full bg-gradient-to-r from-[#9ECFD4] via-[#78B9B5] to-[#016B61] hover:from-[#78B9B5] hover:via-[#016B61] hover:to-[#9ECFD4] text-black py-5 rounded-xl font-black text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 shadow-2xl hover:shadow-3xl"
//       >
//         {isProcessing ? (
//           <>
//             <svg className="animate-spin h-6 w-6 text-black" viewBox="0 0 24 24" fill="none">
//               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//             </svg>
//             Processing Payment...
//           </>
//         ) : (
//           <>
//             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//             Place Order - Rs. {total.toFixed(2)}
//           </>
//         )}
//       </button>

//       <style jsx>{`
//         @keyframes fade-in {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         .animate-fade-in {
//           animation: fade-in 0.3s ease-out;
//         }
//         @keyframes scale-in {
//           from { opacity: 0; transform: scale(0.95); }
//           to { opacity: 1; transform: scale(1); }
//         }
//         .animate-scale-in {
//           animation: scale-in 0.3s ease-out;
//         }
//       `}</style>
//     </form>
//   );
// }

// 1st code:
// 'use client';
// import { useState, FormEvent } from 'react';
// import { useRouter } from 'next/navigation';

// interface CartItem {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
//   image: string;
// }

// interface PaymentFormProps {
//   cartItems: CartItem[];
//   subtotal: number;
//   shipping: number;
//   tax: number;
//   total: number;
// }

// type PaymentMethod = 'easypaisa' | 'jazzcash' | 'cod';

// interface FormData {
//   // Personal Information
//   fullName: string;
//   email: string;
//   phone: string;
  
//   // Shipping Address
//   address: string;
//   city: string;
//   province: string;
//   postalCode: string;
  
//   // Payment
//   paymentMethod: PaymentMethod;
  
//   // Payment Details (for Easypaisa/JazzCash)
//   accountNumber: string;
//   transactionId: string;
// }

// interface FormErrors {
//   [key: string]: string;
// }

// export default function PaymentForm({ cartItems, subtotal, shipping, tax, total }: PaymentFormProps) {
//   const router = useRouter();
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [formData, setFormData] = useState<FormData>({
//     fullName: '',
//     email: '',
//     phone: '',
//     address: '',
//     city: '',
//     province: '',
//     postalCode: '',
//     paymentMethod: 'cod',
//     accountNumber: '',
//     transactionId: ''
//   });
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [showSuccess, setShowSuccess] = useState(false);

//   // Sanitize input to prevent XSS
//   const sanitizeInput = (value: string): string => {
//     return value
//       .replace(/[<>]/g, '') // Remove angle brackets
//       .trim();
//   };

//   // Validate email
//   const validateEmail = (email: string): boolean => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   // Validate phone (Pakistani format)
//   const validatePhone = (phone: string): boolean => {
//     const phoneRegex = /^(\+92|0)?3[0-9]{9}$/;
//     return phoneRegex.test(phone.replace(/\s/g, ''));
//   };

//   // Validate account number (11 digits)
//   const validateAccountNumber = (number: string): boolean => {
//     const numberRegex = /^03[0-9]{9}$/;
//     return numberRegex.test(number.replace(/\s/g, ''));
//   };

//   // Handle input change
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     const sanitizedValue = sanitizeInput(value);
    
//     setFormData(prev => ({
//       ...prev,
//       [name]: sanitizedValue
//     }));
    
//     // Clear error for this field
//     if (errors[name]) {
//       setErrors(prev => {
//         const newErrors = { ...prev };
//         delete newErrors[name];
//         return newErrors;
//       });
//     }
//   };

//   // Validate form
//   const validateForm = (): boolean => {
//     const newErrors: FormErrors = {};

//     // Personal Information
//     if (!formData.fullName || formData.fullName.length < 3) {
//       newErrors.fullName = 'Full name must be at least 3 characters';
//     }

//     if (!formData.email || !validateEmail(formData.email)) {
//       newErrors.email = 'Please enter a valid email address';
//     }

//     if (!formData.phone || !validatePhone(formData.phone)) {
//       newErrors.phone = 'Please enter a valid Pakistani phone number (03XXXXXXXXX)';
//     }

//     // Shipping Address
//     if (!formData.address || formData.address.length < 10) {
//       newErrors.address = 'Please enter a complete address (min 10 characters)';
//     }

//     if (!formData.city || formData.city.length < 3) {
//       newErrors.city = 'Please enter a valid city name';
//     }

//     if (!formData.province) {
//       newErrors.province = 'Please select a province';
//     }

//     if (!formData.postalCode || formData.postalCode.length < 5) {
//       newErrors.postalCode = 'Please enter a valid postal code';
//     }

//     // Payment Method Specific Validation
//     if (formData.paymentMethod === 'easypaisa' || formData.paymentMethod === 'jazzcash') {
//       if (!formData.accountNumber || !validateAccountNumber(formData.accountNumber)) {
//         newErrors.accountNumber = 'Please enter a valid account number (03XXXXXXXXX)';
//       }

//       if (!formData.transactionId || formData.transactionId.length < 10) {
//         newErrors.transactionId = 'Please enter a valid transaction ID';
//       }
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Handle form submission
//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       // Scroll to first error
//       const firstError = document.querySelector('.error-message');
//       firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
//       return;
//     }

//     setIsProcessing(true);

//     try {
//       // Simulate API call to process payment
//       // In production, this would be an actual API call
//       const orderData = {
//         customer: {
//           fullName: formData.fullName,
//           email: formData.email,
//           phone: formData.phone
//         },
//         shipping: {
//           address: formData.address,
//           city: formData.city,
//           province: formData.province,
//           postalCode: formData.postalCode
//         },
//         payment: {
//           method: formData.paymentMethod,
//           accountNumber: formData.accountNumber,
//           transactionId: formData.transactionId
//         },
//         items: cartItems,
//         pricing: {
//           subtotal,
//           shipping,
//           tax,
//           total
//         },
//         timestamp: new Date().toISOString()
//       };

//       // Simulate API delay
//       await new Promise(resolve => setTimeout(resolve, 2000));

//       // Log order (in production, send to backend)
//       console.log('Order placed:', orderData);

//       // Clear cart
//       localStorage.removeItem('cart');

//       // Show success
//       setShowSuccess(true);

//       // Redirect to success page after 2 seconds
//       setTimeout(() => {
//         router.push('/order-success');
//       }, 2000);

//     } catch (error) {
//       console.error('Payment error:', error);
//       setErrors({ submit: 'Payment failed. Please try again.' });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // Success Modal
//   if (showSuccess) {
//     return (
//       <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//         <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center animate-scale-in">
//           <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
//             <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//             </svg>
//           </div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
//           <p className="text-gray-600 mb-4">Your order has been confirmed. Redirecting...</p>
//           <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#016B61] border-t-transparent mx-auto"></div>
//         </div>
//       </div>
//     );
//   }

//   const provinces = [
//     'Punjab',
//     'Sindh',
//     'Khyber Pakhtunkhwa',
//     'Balochistan',
//     'Gilgit-Baltistan',
//     'Azad Kashmir'
//   ];
//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       {/* Personal Information */}
//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
//           <svg className="w-6 h-6 text-[#016B61]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//           </svg>
//           Personal Information
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
//               Full Name *
//             </label>
//             <input
//               type="text"
//               id="fullName"
//               name="fullName"
//               value={formData.fullName}
//               onChange={handleInputChange}
//               className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#016B61] transition-all ${
//                 errors.fullName ? 'border-red-500' : 'border-gray-300'
//               }`}
//               placeholder="John Doe"
//               required
//             />
//             {errors.fullName && (
//               <p className="error-message text-red-600 text-sm mt-1">{errors.fullName}</p>
//             )}
//           </div>

//           <div>
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//               Email Address *
//             </label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleInputChange}
//               className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#016B61] transition-all ${
//                 errors.email ? 'border-red-500' : 'border-gray-300'
//               }`}
//               placeholder="john@example.com"
//               required
//             />
//             {errors.email && (
//               <p className="error-message text-red-600 text-sm mt-1">{errors.email}</p>
//             )}
//           </div>

//           <div className="md:col-span-2">
//             <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
//               Phone Number *
//             </label>
//             <input
//               type="tel"
//               id="phone"
//               name="phone"
//               value={formData.phone}
//               onChange={handleInputChange}
//               className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#016B61] transition-all ${
//                 errors.phone ? 'border-red-500' : 'border-gray-300'
//               }`}
//               placeholder="03001234567"
//               required
//             />
//             {errors.phone && (
//               <p className="error-message text-red-600 text-sm mt-1">{errors.phone}</p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Shipping Address */}
//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
//           <svg className="w-6 h-6 text-[#016B61]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//           </svg>
//           Shipping Address
//         </h2>

//         <div className="space-y-4">
//           <div>
//             <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
//               Complete Address *
//             </label>
//             <textarea
//               id="address"
//               name="address"
//               value={formData.address}
//               onChange={handleInputChange}
//               rows={3}
//               className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#016B61] transition-all ${
//                 errors.address ? 'border-red-500' : 'border-gray-300'
//               }`}
//               placeholder="House/Flat No., Street, Area"
//               required
//             />
//             {errors.address && (
//               <p className="error-message text-red-600 text-sm mt-1">{errors.address}</p>
//             )}
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
//                 City *
//               </label>
//               <input
//                 type="text"
//                 id="city"
//                 name="city"
//                 value={formData.city}
//                 onChange={handleInputChange}
//                 className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#016B61] transition-all ${
//                   errors.city ? 'border-red-500' : 'border-gray-300'
//                 }`}
//                 placeholder="Karachi"
//                 required
//               />
//               {errors.city && (
//                 <p className="error-message text-red-600 text-sm mt-1">{errors.city}</p>
//               )}
//             </div>

//             <div>
//               <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-2">
//                 Province *
//               </label>
//               <select
//                 id="province"
//                 name="province"
//                 value={formData.province}
//                 onChange={handleInputChange}
//                 className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#016B61] transition-all ${
//                   errors.province ? 'border-red-500' : 'border-gray-300'
//                 }`}
//                 required
//               >
//                 <option value="">Select Province</option>
//                 {provinces.map(province => (
//                   <option key={province} value={province}>{province}</option>
//                 ))}
//               </select>
//               {errors.province && (
//                 <p className="error-message text-red-600 text-sm mt-1">{errors.province}</p>
//               )}
//             </div>

//             <div>
//               <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
//                 Postal Code *
//               </label>
//               <input
//                 type="text"
//                 id="postalCode"
//                 name="postalCode"
//                 value={formData.postalCode}
//                 onChange={handleInputChange}
//                 className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#016B61] transition-all ${
//                   errors.postalCode ? 'border-red-500' : 'border-gray-300'
//                 }`}
//                 placeholder="75500"
//                 required
//               />
//               {errors.postalCode && (
//                 <p className="error-message text-red-600 text-sm mt-1">{errors.postalCode}</p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Payment Method */}
//       <div className="bg-white rounded-xl shadow-lg p-6">
//         <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
//           <svg className="w-6 h-6 text-[#016B61]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
//           </svg>
//           Payment Method
//         </h2>

//         <div className="space-y-3">
//           {/* Easypaisa */}
//           <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
//             formData.paymentMethod === 'easypaisa' 
//               ? 'border-[#7AC143] bg-green-50' 
//               : 'border-gray-200 hover:border-[#7AC143]/50'
//           }`}>
//             <input
//               type="radio"
//               name="paymentMethod"
//               value="easypaisa"
//               checked={formData.paymentMethod === 'easypaisa'}
//               onChange={handleInputChange}
//               className="w-5 h-5 text-[#7AC143] focus:ring-[#7AC143]"
//             />
//             <div className="ml-3 flex items-center gap-3 flex-1">
//               <div className="w-12 h-8 bg-[#7AC143] rounded flex items-center justify-center">
//                 <span className="text-white text-xs font-bold">EP</span>
//               </div>
//               <div>
//                 <div className="font-semibold text-gray-900">Easypaisa</div>
//                 <div className="text-sm text-gray-600">Pay via Easypaisa account</div>
//               </div>
//             </div>
//           </label>

//           {/* JazzCash */}
//           <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
//             formData.paymentMethod === 'jazzcash' 
//               ? 'border-[#DC0000] bg-red-50' 
//               : 'border-gray-200 hover:border-[#DC0000]/50'
//           }`}>
//             <input
//               type="radio"
//               name="paymentMethod"
//               value="jazzcash"
//               checked={formData.paymentMethod === 'jazzcash'}
//               onChange={handleInputChange}
//               className="w-5 h-5 text-[#DC0000] focus:ring-[#DC0000]"
//             />
//             <div className="ml-3 flex items-center gap-3 flex-1">
//               <div className="w-12 h-8 bg-[#DC0000] rounded flex items-center justify-center">
//                 <span className="text-white text-xs font-bold">JC</span>
//               </div>
//               <div>
//                 <div className="font-semibold text-gray-900">JazzCash</div>
//                 <div className="text-sm text-gray-600">Pay via JazzCash account</div>
//               </div>
//             </div>
//           </label>

//           {/* Cash on Delivery */}
//           <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
//             formData.paymentMethod === 'cod' 
//               ? 'border-[#016B61] bg-[#016B61]/5' 
//               : 'border-gray-200 hover:border-[#016B61]/50'
//           }`}>
//             <input
//               type="radio"
//               name="paymentMethod"
//               value="cod"
//               checked={formData.paymentMethod === 'cod'}
//               onChange={handleInputChange}
//               className="w-5 h-5 text-[#016B61] focus:ring-[#016B61]"
//             />
//             <div className="ml-3 flex items-center gap-3 flex-1">
//               <div className="w-12 h-8 bg-[#016B61] rounded flex items-center justify-center">
//                 <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
//                 </svg>
//               </div>
//               <div>
//                 <div className="font-semibold text-gray-900">Cash on Delivery</div>
//                 <div className="text-sm text-gray-600">Pay when you receive</div>
//               </div>
//             </div>
//           </label>
//         </div>

//         {/* Payment Details for Easypaisa/JazzCash */}
//         {(formData.paymentMethod === 'easypaisa' || formData.paymentMethod === 'jazzcash') && (
//           <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-4">
//             <div className="flex items-start gap-2 text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">
//               <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <p>
//                 <strong>Instructions:</strong> Please transfer Rs. {total.toFixed(2)} to our {formData.paymentMethod === 'easypaisa' ? 'Easypaisa' : 'JazzCash'} account <strong>03001234567</strong> and enter the details below.
//               </p>
//             </div>

//             <div>
//               <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-2">
//                 Your {formData.paymentMethod === 'easypaisa' ? 'Easypaisa' : 'JazzCash'} Account Number *
//               </label>
//               <input
//                 type="tel"
//                 id="accountNumber"
//                 name="accountNumber"
//                 value={formData.accountNumber}
//                 onChange={handleInputChange}
//                 className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#016B61] transition-all ${
//                   errors.accountNumber ? 'border-red-500' : 'border-gray-300'
//                 }`}
//                 placeholder="03001234567"
//                 required
//               />
//               {errors.accountNumber && (
//                 <p className="error-message text-red-600 text-sm mt-1">{errors.accountNumber}</p>
//               )}
//             </div>

//             <div>
//               <label htmlFor="transactionId" className="block text-sm font-medium text-gray-700 mb-2">
//                 Transaction ID *
//               </label>
//               <input
//                 type="text"
//                 id="transactionId"
//                 name="transactionId"
//                 value={formData.transactionId}
//                 onChange={handleInputChange}
//                 className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#016B61] transition-all ${
//                   errors.transactionId ? 'border-red-500' : 'border-gray-300'
//                 }`}
//                 placeholder="Enter transaction ID"
//                 required
//               />
//               {errors.transactionId && (
//                 <p className="error-message text-red-600 text-sm mt-1">{errors.transactionId}</p>
//               )}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Submit Error */}
//       {errors.submit && (
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//           <div className="flex items-center gap-2 text-red-800">
//             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//             <p className="font-medium">{errors.submit}</p>
//           </div>
//         </div>
//       )}

//       {/* Submit Button */}
//       <button
//         type="submit"
//         disabled={isProcessing}
//         className="w-full bg-[#016B61] text-white py-4 rounded-lg font-semibold text-lg hover:bg-[#014a43] disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
//       >
//         {isProcessing ? (
//           <>
//             <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
//               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//             </svg>
//             Processing...
//           </>
//         ) : (
//           <>
//             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//             Place Order - Rs. {total.toFixed(2)}
//           </>
//         )}
//       </button>
//     </form>
//   );
// }