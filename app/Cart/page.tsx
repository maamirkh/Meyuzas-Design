"use client";
import { Product } from "../../types/product";
import React, { useEffect, useState } from "react";
import {
  getCartItems,
  removeFromCart,
  updateCartQuantity,
} from "../../actions/actions";
import { useCart } from "../context/CartContext";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import Swal from "sweetalert2";
import {
  FiShoppingCart,
  FiTrash2,
  FiPlus,
  FiMinus,
  FiArrowRight,
  FiPackage,
  FiShield,
  FiPercent,
  FiStar,
  FiHeart
} from "react-icons/fi";
import { useRouter } from "next/navigation";

const CartPage = () => {
  const { updateCartCount } = useCart();
  const [cartItems, setCartItems] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      return getCartItems();
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState(true);
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Cart items are now initialized in useState, this effect now only handles the loading state.
    setTimeout(() => setIsLoading(false), 300);
  }, []);

  const toggleLike = (id: string) => {
    setLikedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleRemove = (id: string, productName: string) => {
    Swal.fire({
      title: '<span style="color: #016B61; font-weight: 700;">Remove Item?</span>',
      html: `<p style="color: #016B61; margin-top: 8px;">Are you sure you want to remove <strong style="color: #78B9B5;">${productName}</strong> from your cart?</p>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#016B61",
      cancelButtonColor: "#9ECFD4",
      confirmButtonText: '<span style="font-weight: 600;">Yes, Remove It</span>',
      cancelButtonText: '<span style="font-weight: 600;">Keep It</span>',
      background: '#ffffff',
      customClass: {
        popup: 'rounded-3xl shadow-2xl border border-[#9ECFD4]',
        confirmButton: 'rounded-xl px-6 py-3 shadow-lg',
        cancelButton: 'rounded-xl px-6 py-3'
      },
      buttonsStyling: true
    }).then((result) => {
      if (result.isConfirmed) {
        removeFromCart(id);
        setCartItems(getCartItems());
        updateCartCount();

        Swal.fire({
          title: '<span style="color: #016B61; font-weight: 700;">Removed Successfully!</span>',
          html: '<p style="color: #78B9B5;">Item has been removed from your cart</p>',
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          background: '#ffffff',
          customClass: {
            popup: 'rounded-3xl shadow-2xl'
          }
        });
      }
    });
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 1) return;
    updateCartQuantity(id, quantity);
    setCartItems(getCartItems());
    updateCartCount();
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.inventory, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal(); // Tax removed
  };

  const router = useRouter();

  const handleProceed = () => {
    Swal.fire({
      title: '<span style="color: #016B61; font-weight: 700;">Complete Your Order</span>',
      html: `
        <div style="text-align: left; padding: 16px; background: linear-gradient(to bottom right, #9ECFD4, #78B9B5); border-radius: 16px; margin: 16px 0;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
            <div style="background: #016B61; padding: 8px; border-radius: 50%;">
              <svg style="width: 20px; height: 20px; color: white;" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
              </svg>
            </div>
            <span style="color: #016B61; font-weight: 600;">Secure Payment Gateway</span>
          </div>
        </div>
        <p style="color: #016B61; margin-top: 16px; font-size: 14px;">Total Amount: <strong style="color: #78B9B5; font-size: 18px;">Rs. ${calculateTotal().toFixed(2)}</strong></p>
      `,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#016B61",
      cancelButtonColor: "#9ECFD4",
      confirmButtonText: '<span style="font-weight: 600;">Continue to Checkout →</span>',
      cancelButtonText: '<span style="font-weight: 600;">Keep Shopping</span>',
      reverseButtons: true,
      background: '#ffffff',
      customClass: {
        popup: 'rounded-3xl shadow-2xl border-2 border-[#9ECFD4]',
        confirmButton: 'rounded-xl px-8 py-3 shadow-lg',
        cancelButton: 'rounded-xl px-8 py-3'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: '<span style="color: #016B61; font-weight: 700;">Order Confirmed! 🎉</span>',
          html: '<p style="color: #78B9B5;">Redirecting to secure checkout...</p>',
          icon: "success",
          timer: 1800,
          showConfirmButton: false,
          background: '#ffffff',
          customClass: {
            popup: 'rounded-3xl shadow-2xl'
          }
        });
        setTimeout(() => {
          router.push("/check-out");
        }, 1800);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#9ECFD4] via-[#78B9B5] to-[#016B61] flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-[#9ECFD4] border-t-[#016B61] rounded-full animate-spin"></div>
          <FiShoppingCart className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-[#016B61]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#9ECFD4] via-[#78B9B5] to-[#016B61]/20 py-6 px-4 sm:px-6">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#9ECFD4] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-[#78B9B5] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-[#016B61] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header with Animation */}
        <div className="mb-6 md:mb-10 animate-slide-down">
          <div className="flex flex-col items-start gap-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#78B9B5] to-[#016B61] rounded-2xl blur-lg opacity-50"></div>
                <div className="relative p-4 bg-gradient-to-br from-[#78B9B5] to-[#016B61] rounded-2xl shadow-xl">
                  <FiShoppingCart className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#016B61]">
                  Shopping Cart
                </h1>
                <p className="text-[#016B61]/80 font-medium mt-1">
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} ready for checkout
                </p>
              </div>
            </div>
          </div>

          {/* Trust Badges - Responsive */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mt-4">
            {[
              { icon: FiShield, text: "Secure Checkout", color: "[#016B61]" },
              { icon: FiPercent, text: "Best Prices", color: "[#9ECFD4]" }
            ].map((badge, i) => (
              <div key={i} className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-white rounded-full shadow-sm border border-${badge.color} animate-fade-in text-xs sm:text-sm`} style={{ animationDelay: `${i * 100}ms` }}>
                <badge.icon className={`w-3 sm:w-4 h-3 sm:h-4 text-${badge.color}`} />
                <span className="font-semibold text-[#016B61]">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>

        {cartItems.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Cart Items - Full width on mobile, side by side on larger screens */}
            <div className="w-full lg:w-2/3 space-y-4">
              {cartItems.map((item, index) => (
                <div
                  key={item._id}
                  className="group relative bg-white rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden border border-[#9ECFD4]/30 sm:border-2 sm:border-transparent hover:border-[#78B9B5] animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#9ECFD4]/20 via-[#78B9B5]/20 to-[#016B61]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"></div>

                  <div className="p-4 sm:p-6 relative">
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                      {/* Product Image - Full width on mobile, side by side on larger screens */}
                      {item.image && (
                        <div className="relative flex-shrink-0 w-full sm:w-24 md:w-36 h-24 md:h-36">
                          <div className="relative w-full h-full rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-[#9ECFD4]/20 to-[#78B9B5]/20 shadow-lg group-hover:scale-[1.02] transition-transform duration-500">
                            <Image
                              src={urlFor(item.image).url()}
                              fill
                              alt={item.productName}
                              className="object-cover"
                              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 150px"
                            />
                          </div>
                          {/* Like Button */}
                          <button
                            onClick={() => toggleLike(item._id)}
                            className="absolute -top-2 -right-2 p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-transform duration-300"
                          >
                            <FiHeart
                              className={`w-4 h-4 transition-colors duration-300 ${
                                likedItems.has(item._id) ? 'fill-[#016B61] text-[#016B61]' : 'text-gray-400'
                              }`}
                            />
                          </button>
                        </div>
                      )}

                      {/* Product Details - Full width on mobile */}
                      <div className="flex-1 flex flex-col min-w-0 w-full">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0 mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg sm:text-xl font-bold text-[#016B61] group-hover:text-[#78B9B5] transition-colors duration-300 truncate">
                              {item.productName}
                            </h3>
                            {/* Rating */}
                            <div className="flex items-center gap-1 mt-1 sm:mt-2">
                              {[...Array(5)].map((_, i) => (
                                <FiStar key={i} className="w-3 sm:w-4 h-3 sm:h-4 fill-[#78B9B5] text-[#78B9B5]" />
                              ))}
                              <span className="text-xs sm:text-sm text-[#016B61]/70 ml-1">(4.9)</span>
                            </div>
                          </div>
                          {/* Delete Button */}
                          <button
                            onClick={() => handleRemove(item._id, item.productName)}
                            className="p-2 sm:p-3 hover:bg-red-50 rounded-lg sm:rounded-xl transition-all duration-300 group/del flex-shrink-0"
                          >
                            <FiTrash2 className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400 group-hover/del:text-red-500 transition-colors" />
                          </button>
                        </div>

                        {/* Price Badge - Responsive sizing */}
                        <div className="mb-3 sm:mb-4">
                          <div className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-[#9ECFD4]/30 to-[#78B9B5]/30 rounded-lg sm:rounded-xl border border-[#78B9B5]/30">
                            <span className="text-xs sm:text-sm text-[#016B61] font-medium">Unit Price:</span>
                            <span className="text-lg sm:text-2xl font-black text-[#016B61]">
                              Rs. {item.price}
                            </span>
                          </div>
                        </div>

                        {/* Quantity & Subtotal - Responsive layout */}
                        <div className="mt-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-semibold text-[#016B61]">Qty:</span>
                            <div className="flex items-center gap-0.5 sm:gap-1 bg-gradient-to-r from-[#9ECFD4]/20 to-[#78B9B5]/20 rounded-xl sm:rounded-2xl p-1 border-2 border-[#78B9B5]/30 shadow-inner">
                              <button
                                onClick={() => handleQuantityChange(item._id, item.inventory - 1)}
                                disabled={item.inventory <= 1}
                                className="p-1.5 sm:p-2.5 hover:bg-white rounded-lg sm:rounded-xl transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 shadow-sm"
                              >
                                <FiMinus className="w-3 sm:w-4 h-3 sm:h-4 text-[#016B61]" />
                              </button>
                              <div className="px-3 sm:px-6 py-1.5 sm:py-2 bg-white rounded-lg sm:rounded-xl shadow-sm">
                                <span className="font-black text-[#016B61] text-sm sm:text-lg">
                                  {item.inventory}
                                </span>
                              </div>
                              <button
                                onClick={() => handleQuantityChange(item._id, item.inventory + 1)}
                                className="p-1.5 sm:p-2.5 hover:bg-white rounded-lg sm:rounded-xl transition-all duration-300 active:scale-95 shadow-sm"
                              >
                                <FiPlus className="w-3 sm:w-4 h-3 sm:h-4 text-[#016B61]" />
                              </button>
                            </div>
                          </div>

                          {/* Item Subtotal */}
                          <div className="text-right sm:text-right">
                            <p className="text-xs text-[#016B61]/70 font-medium mb-1">Subtotal</p>
                            <p className="text-xl sm:text-3xl font-black text-[#016B61]">
                              Rs. {(item.price * item.inventory).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary - Full width on mobile, sticky on larger screens */}
            <div className="w-full lg:w-1/3">
              <div className="space-y-6">
                {/* Main Summary Card */}
                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-4 sm:p-8 border border-[#9ECFD4] sm:border-2 overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-gradient-to-br from-[#9ECFD4]/30 to-[#78B9B5]/30 rounded-full -mr-12 sm:-mr-20 -mt-12 sm:-mt-20 opacity-50"></div>

                  <div className="relative">
                    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                      <div className="p-2 sm:p-3 bg-gradient-to-br from-[#78B9B5] to-[#016B61] rounded-lg sm:rounded-xl shadow-lg">
                        <FiPackage className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-[#016B61]">Order Summary</h2>
                    </div>

                    <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                      <div className="flex justify-between items-center p-3 sm:p-4 bg-[#9ECFD4]/10 rounded-lg sm:rounded-xl">
                        <span className="text-[#016B61] font-medium text-sm sm:text-base">Subtotal ({cartItems.length} items)</span>
                        <span className="font-bold text-[#016B61] text-sm sm:text-base">Rs. {calculateSubtotal().toFixed(2)}</span>
                      </div>

                      {/* Total */}
                      <div className="border-t border-[#9ECFD4]/30 sm:border-t-2">
                        <div className="flex justify-between items-center p-3 sm:p-4 bg-gradient-to-r from-[#9ECFD4]/20 to-[#78B9B5]/20 rounded-xl sm:rounded-2xl border border-[#78B9B5]/30 sm:border-2">
                          <span className="text-lg font-black text-[#016B61]">Total</span>
                          <div className="text-right">
                            <span className="text-2xl sm:text-4xl font-black text-[#016B61]">
                              Rs. {calculateTotal().toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <button
                      onClick={handleProceed}
                      className="w-full relative bg-gradient-to-r from-[#9ECFD4] via-[#78B9B5] to-[#016B61] hover:from-[#78B9B5] hover:via-[#016B61] hover:to-[#9ECFD4] text-black py-4 sm:py-5 px-6 sm:px-8 rounded-xl sm:rounded-2xl font-black text-base sm:text-lg shadow-lg sm:shadow-2xl hover:shadow-xl sm:hover:shadow-3xl transition-all duration-500 flex items-center justify-center gap-2 sm:gap-3 group overflow-hidden"
                    >
                      <span className="relative z-10">Proceed to Checkout</span>
                      <FiArrowRight className="w-5 sm:w-6 h-5 sm:h-6 relative z-10 group-hover:translate-x-1 sm:group-hover:translate-x-2 transition-transform duration-300" />
                    </button>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="bg-gradient-to-br from-[#9ECFD4]/20 via-[#78B9B5]/20 to-[#016B61]/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-[#9ECFD4]/30 sm:border-2 shadow-lg">
                  <h3 className="font-black text-[#016B61] mb-3 sm:mb-4 text-lg">Why Shop With Us?</h3>
                  <div className="space-y-2 sm:space-y-3">
                    {[
                      { icon: FiShield, text: "100% Secure Payments", color: "[#016B61]" },
                      { icon: FiPercent, text: "Best Price Guarantee", color: "[#9ECFD4]" },
                      { icon: FiStar, text: "Rated 4.9/5 by Customers", color: "[#016B61]" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                        <div className={`p-1.5 sm:p-2 bg-${item.color}/10 rounded-lg`}>
                          <item.icon className={`w-4 sm:w-5 h-4 sm:h-5 text-${item.color}`} />
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-[#016B61]">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Empty Cart - Responsive
          <div className="max-w-2xl mx-auto text-center py-10 sm:py-20 animate-fade-in">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-8 sm:p-16 border border-[#9ECFD4] sm:border-2 relative overflow-hidden">
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-8 left-8 w-24 h-24 sm:w-32 sm:h-32 bg-[#9ECFD4] rounded-full blur-3xl"></div>
                <div className="absolute bottom-8 right-8 w-24 h-24 sm:w-32 sm:h-32 bg-[#78B9B5] rounded-full blur-3xl"></div>
              </div>

              <div className="relative">
                <div className="mb-6 sm:mb-8 inline-block">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#78B9B5] to-[#016B61] rounded-full blur-xl sm:blur-2xl opacity-30 animate-pulse"></div>
                    <div className="relative p-6 sm:p-8 bg-gradient-to-br from-[#9ECFD4]/20 to-[#78B9B5]/20 rounded-full">
                      <FiShoppingCart className="w-16 h-16 sm:w-20 sm:h-20 text-[#016B61]" />
                    </div>
                  </div>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-[#016B61] mb-3 sm:mb-4">Your Cart is Empty</h2>
                <p className="text-[#016B61]/70 text-base sm:text-lg mb-6 sm:mb-10 max-w-md mx-auto">
                  Looks like you haven&apos;t added anything to your cart yet. Start shopping to discover amazing products!
                </p>
                <button
                  onClick={() => router.push("/")}
                  className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-[#9ECFD4] via-[#78B9B5] to-[#016B61] hover:from-[#78B9B5] hover:via-[#016B61] hover:to-[#9ECFD4] text-black py-4 px-8 sm:py-5 sm:px-10 rounded-xl sm:rounded-2xl font-black text-base sm:text-lg shadow-lg sm:shadow-2xl hover:shadow-xl sm:hover:shadow-3xl transition-all duration-500 group"
                >
                  Start Shopping
                  <FiArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 sm:group-hover:translate-x-2 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 10s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down {
          animation: slide-down 0.6s ease-out;
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.5s ease-out forwards;
          opacity: 0;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default CartPage;


// 2nd code
// "use client";
// import { Product } from "../../types/product";
// import React, { useEffect, useState } from "react";
// import {
//   getCartItems,
//   removeFromCart,
//   updateCartQuantity,
// } from "../../actions/actions";
// import { useCart } from "../context/CartContext"; // ✅ Add this import
// import Image from "next/image";
// import { urlFor } from "@/sanity/lib/image";
// import Swal from "sweetalert2";
// import { 
//   FiShoppingCart, 
//   FiTrash2, 
//   FiPlus, 
//   FiMinus,
//   FiArrowRight,
//   FiPackage,
//   FiTruck,
//   FiShield,
//   FiPercent,
//   FiStar,
//   FiHeart
// } from "react-icons/fi";
// import { useRouter } from "next/navigation";

// const CartPage = () => {
//   const { updateCartCount } = useCart(); // ✅ Add this line
//   const [cartItems, setCartItems] = useState<Product[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [likedItems, setLikedItems] = useState<Set<string>>(new Set());

//   useEffect(() => {
//     setCartItems(getCartItems());
//     setTimeout(() => setIsLoading(false), 300);
//   }, []);

//   const toggleLike = (id: string) => {
//     setLikedItems(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(id)) {
//         newSet.delete(id);
//       } else {
//         newSet.add(id);
//       }
//       return newSet;
//     });
//   };

//   const handleRemove = (id: string, productName: string) => {
//     Swal.fire({
//       title: '<span style="color: #1e293b; font-weight: 700;">Remove Item?</span>',
//       html: `<p style="color: #64748b; margin-top: 8px;">Are you sure you want to remove <strong style="color: #3b82f6;">${productName}</strong> from your cart?</p>`,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#ef4444",
//       cancelButtonColor: "#94a3b8",
//       confirmButtonText: '<span style="font-weight: 600;">Yes, Remove It</span>',
//       cancelButtonText: '<span style="font-weight: 600;">Keep It</span>',
//       background: '#ffffff',
//       customClass: {
//         popup: 'rounded-3xl shadow-2xl border border-slate-200',
//         confirmButton: 'rounded-xl px-6 py-3 shadow-lg',
//         cancelButton: 'rounded-xl px-6 py-3'
//       },
//       buttonsStyling: true
//     }).then((result) => {
//       if (result.isConfirmed) {
//         removeFromCart(id);
//         setCartItems(getCartItems());
//         updateCartCount(); // ✅ Add this line
        
//         Swal.fire({
//           title: '<span style="color: #10b981; font-weight: 700;">Removed Successfully!</span>',
//           html: '<p style="color: #64748b;">Item has been removed from your cart</p>',
//           icon: "success",
//           timer: 2000,
//           showConfirmButton: false,
//           background: '#ffffff',
//           customClass: {
//             popup: 'rounded-3xl shadow-2xl'
//           }
//         });
//       }
//     });
//   };

//   const handleQuantityChange = (id: string, quantity: number) => {
//     if (quantity < 1) return;
//     updateCartQuantity(id, quantity);
//     setCartItems(getCartItems());
//     updateCartCount(); // ✅ Add this line
//   };

//   const calculateSubtotal = () => {
//     return cartItems.reduce((total, item) => total + item.price * item.inventory, 0);
//   };

//   const calculateTax = () => {
//     return calculateSubtotal() * 0.08;
//   };

//   const calculateTotal = () => {
//     return calculateSubtotal() + calculateTax();
//   };

//   const router = useRouter();

//   const handleProceed = () => {
//     Swal.fire({
//       title: '<span style="color: #1e293b; font-weight: 700;">Complete Your Order</span>',
//       html: `
//         <div style="text-align: left; padding: 16px; background: linear-gradient(to bottom right, #f0f9ff, #e0f2fe); border-radius: 16px; margin: 16px 0;">
//           <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
//             <div style="background: #10b981; padding: 8px; border-radius: 50%;">
//               <svg style="width: 20px; height: 20px; color: white;" fill="currentColor" viewBox="0 0 20 20">
//                 <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
//               </svg>
//             </div>
//             <span style="color: #0f172a; font-weight: 600;">Secure Payment Gateway</span>
//           </div>
//           <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
//             <div style="background: #10b981; padding: 8px; border-radius: 50%;">
//               <svg style="width: 20px; height: 20px; color: white;" fill="currentColor" viewBox="0 0 20 20">
//                 <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
//               </svg>
//             </div>
//             <span style="color: #0f172a; font-weight: 600;">Free Express Delivery</span>
//           </div>
//           <div style="display: flex; align-items: center; gap: 12px;">
//             <div style="background: #10b981; padding: 8px; border-radius: 50%;">
//               <svg style="width: 20px; height: 20px; color: white;" fill="currentColor" viewBox="0 0 20 20">
//                 <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
//               </svg>
//             </div>
//             <span style="color: #0f172a; font-weight: 600;">30-Day Money Back Guarantee</span>
//           </div>
//         </div>
//         <p style="color: #64748b; margin-top: 16px; font-size: 14px;">Total Amount: <strong style="color: #3b82f6; font-size: 18px;">$${calculateTotal().toFixed(2)}</strong></p>
//       `,
//       icon: "info",
//       showCancelButton: true,
//       confirmButtonColor: "#3b82f6",
//       cancelButtonColor: "#94a3b8",
//       confirmButtonText: '<span style="font-weight: 600;">Continue to Checkout →</span>',
//       cancelButtonText: '<span style="font-weight: 600;">Keep Shopping</span>',
//       reverseButtons: true,
//       background: '#ffffff',
//       customClass: {
//         popup: 'rounded-3xl shadow-2xl border border-slate-200',
//         confirmButton: 'rounded-xl px-8 py-3 shadow-lg',
//         cancelButton: 'rounded-xl px-8 py-3'
//       }
//     }).then((result) => {
//       if (result.isConfirmed) {
//         Swal.fire({
//           title: '<span style="color: #10b981; font-weight: 700;">Order Confirmed! 🎉</span>',
//           html: '<p style="color: #64748b;">Redirecting to secure checkout...</p>',
//           icon: "success",
//           timer: 1800,
//           showConfirmButton: false,
//           background: '#ffffff',
//           customClass: {
//             popup: 'rounded-3xl shadow-2xl'
//           }
//         });
//         setTimeout(() => {
//           // router.push("/Checkout");
//           router.push("/check-out");
//         }, 1800);
//       }
//     });
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
//         <div className="relative">
//           <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
//           <FiShoppingCart className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-blue-600" />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
//       {/* Floating Background Elements */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
//         <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
//         <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
//       </div>

//       <div className="max-w-7xl mx-auto relative z-10">
//         {/* Header with Animation */}
//         <div className="mb-10 animate-slide-down">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center gap-4">
//               <div className="relative">
//                 <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-50"></div>
//                 <div className="relative p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-xl">
//                   <FiShoppingCart className="w-8 h-8 text-white" />
//                 </div>
//               </div>
//               <div>
//                 <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
//                   Shopping Cart
//                 </h1>
//                 <p className="text-slate-600 font-medium mt-1">
//                   {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} ready for checkout
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Trust Badges */}
//           <div className="flex flex-wrap gap-3 mt-6">
//             {[
//               { icon: FiShield, text: "Secure Checkout", color: "blue" },
//               { icon: FiTruck, text: "Free Shipping", color: "green" },
//               { icon: FiPercent, text: "Best Prices", color: "purple" }
//             ].map((badge, i) => (
//               <div key={i} className={`flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-${badge.color}-100 animate-fade-in`} style={{ animationDelay: `${i * 100}ms` }}>
//                 <badge.icon className={`w-4 h-4 text-${badge.color}-600`} />
//                 <span className="text-sm font-semibold text-slate-700">{badge.text}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {cartItems.length > 0 ? (
//           <div className="grid lg:grid-cols-3 gap-8">
//             {/* Cart Items */}
//             <div className="lg:col-span-2 space-y-4">
//               {cartItems.map((item, index) => (
//                 <div
//                   key={item._id}
//                   className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-transparent hover:border-blue-200 animate-slide-up"
//                   style={{ animationDelay: `${index * 100}ms` }}
//                 >
//                   {/* Gradient Border Effect on Hover */}
//                   <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"></div>
                  
//                   <div className="p-6 relative">
//                     <div className="flex gap-6">
//                       {/* Product Image with Badge */}
//                       {item.image && (
//                         <div className="relative flex-shrink-0">
//                           <div className="relative w-36 h-36 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 shadow-lg group-hover:scale-105 transition-transform duration-500">
//                             <Image
//                               src={urlFor(item.image).url()}
//                               fill
//                               alt={item.productName}
//                               className="object-cover"
//                             />
//                           </div>
//                           {/* Like Button */}
//                           <button
//                             onClick={() => toggleLike(item._id)}
//                             className="absolute -top-2 -right-2 p-2.5 bg-white rounded-full shadow-lg hover:scale-110 transition-transform duration-300"
//                           >
//                             <FiHeart 
//                               className={`w-5 h-5 transition-colors duration-300 ${
//                                 likedItems.has(item._id) ? 'fill-red-500 text-red-500' : 'text-slate-400'
//                               }`} 
//                             />
//                           </button>
//                           {/* Category Badge */}
//                           {item.category && (
//                             <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
//                               {item.category}
//                             </div>
//                           )}
//                         </div>
//                       )}

//                       {/* Product Details */}
//                       <div className="flex-1 flex flex-col min-w-0">
//                         <div className="flex justify-between items-start mb-3">
//                           <div className="flex-1 min-w-0 pr-4">
//                             <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-300 truncate">
//                               {item.productName}
//                             </h3>
//                             {/* Rating Stars */}
//                             <div className="flex items-center gap-1 mt-2">
//                               {[...Array(5)].map((_, i) => (
//                                 <FiStar key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
//                               ))}
//                               <span className="text-sm text-slate-500 ml-1">(4.9)</span>
//                             </div>
//                           </div>
//                           {/* Delete Button */}
//                           <button
//                             onClick={() => handleRemove(item._id, item.productName)}
//                             className="p-3 hover:bg-red-50 rounded-xl transition-all duration-300 group/del flex-shrink-0"
//                           >
//                             <FiTrash2 className="w-5 h-5 text-slate-400 group-hover/del:text-red-500 transition-colors" />
//                           </button>
//                         </div>

//                         {/* Price Badge */}
//                         <div className="mb-4">
//                           <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
//                             <span className="text-sm text-slate-600 font-medium">Unit Price:</span>
//                             <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                               ${item.price}
//                             </span>
//                           </div>
//                         </div>

//                         {/* Quantity & Subtotal */}
//                         <div className="mt-auto flex items-center justify-between">
//                           {/* Quantity Controls */}
//                           <div className="flex items-center gap-2">
//                             <span className="text-sm font-semibold text-slate-600">Qty:</span>
//                             <div className="flex items-center gap-1 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-1.5 border-2 border-slate-200 shadow-inner">
//                               <button
//                                 onClick={() => handleQuantityChange(item._id, item.inventory - 1)}
//                                 disabled={item.inventory <= 1}
//                                 className="p-2.5 hover:bg-white rounded-xl transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 shadow-sm"
//                               >
//                                 <FiMinus className="w-4 h-4 text-slate-700" />
//                               </button>
//                               <div className="px-6 py-2 bg-white rounded-xl shadow-sm">
//                                 <span className="font-black text-slate-900 text-lg">
//                                   {item.inventory}
//                                 </span>
//                               </div>
//                               <button
//                                 onClick={() => handleQuantityChange(item._id, item.inventory + 1)}
//                                 className="p-2.5 hover:bg-white rounded-xl transition-all duration-300 active:scale-95 shadow-sm"
//                               >
//                                 <FiPlus className="w-4 h-4 text-slate-700" />
//                               </button>
//                             </div>
//                           </div>

//                           {/* Item Subtotal */}
//                           <div className="text-right">
//                             <p className="text-xs text-slate-500 font-medium mb-1">Subtotal</p>
//                             <p className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                               ${(item.price * item.inventory).toFixed(2)}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Order Summary - Sticky */}
//             <div className="lg:col-span-1">
//               <div className="sticky top-8 space-y-6">
//                 {/* Main Summary Card */}
//                 <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-slate-100 overflow-hidden relative">
//                   {/* Background Decoration */}
//                   <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full -mr-20 -mt-20 opacity-50"></div>
                  
//                   <div className="relative">
//                     <div className="flex items-center gap-3 mb-6">
//                       <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg">
//                         <FiPackage className="w-6 h-6 text-white" />
//                       </div>
//                       <h2 className="text-2xl font-black text-slate-900">Order Summary</h2>
//                     </div>

//                     <div className="space-y-4 mb-6">
//                       <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
//                         <span className="text-slate-600 font-medium">Subtotal ({cartItems.length} items)</span>
//                         <span className="font-bold text-slate-900">${calculateSubtotal().toFixed(2)}</span>
//                       </div>
//                       <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl border border-green-100">
//                         <span className="text-green-700 font-medium flex items-center gap-2">
//                           <FiTruck className="w-4 h-4" />
//                           Shipping
//                         </span>
//                         <span className="font-bold text-green-600">FREE</span>
//                       </div>
//                       <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
//                         <span className="text-slate-600 font-medium">Tax (8%)</span>
//                         <span className="font-bold text-slate-900">${calculateTax().toFixed(2)}</span>
//                       </div>
                      
//                       {/* Total */}
//                       <div className="pt-4 border-t-2 border-slate-200">
//                         <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200">
//                           <span className="text-xl font-black text-slate-900">Total</span>
//                           <div className="text-right">
//                             <span className="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                               ${calculateTotal().toFixed(2)}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Checkout Button */}
//                     <button
//                       onClick={handleProceed}
//                       className="w-full relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white py-5 px-8 rounded-2xl font-black text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center gap-3 group overflow-hidden"
//                     >
//                       <span className="relative z-10">Proceed to Checkout</span>
//                       <FiArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
//                       {/* Animated background */}
//                       <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
//                     </button>
//                   </div>
//                 </div>

//                 {/* Trust Badges Card */}
//                 <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl p-6 border-2 border-blue-100 shadow-lg">
//                   <h3 className="font-black text-slate-900 mb-4 text-lg">Why Shop With Us?</h3>
//                   <div className="space-y-3">
//                     {[
//                       { icon: FiShield, text: "100% Secure Payments", color: "blue" },
//                       { icon: FiTruck, text: "Free Express Delivery", color: "green" },
//                       { icon: FiPercent, text: "Best Price Guarantee", color: "purple" },
//                       { icon: FiStar, text: "Rated 4.9/5 by Customers", color: "yellow" }
//                     ].map((item, index) => (
//                       <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
//                         <div className={`p-2 bg-${item.color}-100 rounded-lg`}>
//                           <item.icon className={`w-5 h-5 text-${item.color}-600`} />
//                         </div>
//                         <span className="text-sm font-bold text-slate-700">{item.text}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ) : (
//           // Empty Cart State
//           <div className="max-w-2xl mx-auto text-center py-20 animate-fade-in">
//             <div className="bg-white rounded-3xl shadow-2xl p-16 border-2 border-slate-100 relative overflow-hidden">
//               {/* Background decoration */}
//               <div className="absolute inset-0 opacity-5">
//                 <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
//                 <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-500 rounded-full blur-3xl"></div>
//               </div>
              
//               <div className="relative">
//                 <div className="mb-8 inline-block">
//                   <div className="relative">
//                     <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-2xl opacity-30 animate-pulse"></div>
//                     <div className="relative p-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full">
//                       <FiShoppingCart className="w-20 h-20 text-slate-400" />
//                     </div>
//                   </div>
//                 </div>
//                 <h2 className="text-4xl font-black text-slate-900 mb-4">Your Cart is Empty</h2>
//                 <p className="text-slate-600 text-lg mb-10 max-w-md mx-auto">
//                   Looks like you haven't added anything to your cart yet. Start shopping to discover amazing products!
//                 </p>
//                 <button
//                   onClick={() => router.push("/")}
//                   className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white py-5 px-10 rounded-2xl font-black text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 group"
//                 >
//                   Start Shopping
//                   <FiArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       <style jsx>{`
//         @keyframes blob {
//           0%, 100% { transform: translate(0, 0) scale(1); }
//           25% { transform: translate(20px, -50px) scale(1.1); }
//           50% { transform: translate(-20px, 20px) scale(0.9); }
//           75% { transform: translate(50px, 50px) scale(1.05); }
//         }
//         .animate-blob {
//           animation: blob 10s infinite;
//         }
//         .animation-delay-2000 {
//           animation-delay: 2s;
//         }
//         .animation-delay-4000 {
//           animation-delay: 4s;
//         }
//         @keyframes slide-down {
//           from {
//             opacity: 0;
//             transform: translateY(-30px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-slide-down {
//           animation: slide-down 0.6s ease-out;
//         }
//         @keyframes slide-up {
//           from {
//             opacity: 0;
//             transform: translateY(30px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-slide-up {
//           animation: slide-up 0.5s ease-out forwards;
//           opacity: 0;
//         }
//         @keyframes fade-in {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         .animate-fade-in {
//           animation: fade-in 0.5s ease-out forwards;
//           opacity: 0;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default CartPage;


// Old Code 1st
// "use client";

// import { Product } from "../../types/product";
// import React, { useEffect, useState } from "react";
// import {
//   getCartItems,
//   removeFromCart,
//   updateCartQuantity,
// } from "../../actions/actions";
// import Image from "next/image";
// import { urlFor } from "@/sanity/lib/image";
// import Swal from "sweetalert2";
// import { 
//   FiShoppingCart, 
//   FiTrash2, 
//   FiPlus, 
//   FiMinus,
//   FiArrowRight,
//   FiPackage,
//   FiTruck,
//   FiShield,
//   FiPercent,
//   FiStar,
//   FiHeart
// } from "react-icons/fi";
// import { useRouter } from "next/navigation";

// const CartPage = () => {
//   const [cartItems, setCartItems] = useState<Product[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [likedItems, setLikedItems] = useState<Set<string>>(new Set());

//   useEffect(() => {
//     setCartItems(getCartItems());
//     setTimeout(() => setIsLoading(false), 300);
//   }, []);

//   const toggleLike = (id: string) => {
//     setLikedItems(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(id)) {
//         newSet.delete(id);
//       } else {
//         newSet.add(id);
//       }
//       return newSet;
//     });
//   };

//   const handleRemove = (id: string, productName: string) => {
//     Swal.fire({
//       title: '<span style="color: #1e293b; font-weight: 700;">Remove Item?</span>',
//       html: `<p style="color: #64748b; margin-top: 8px;">Are you sure you want to remove <strong style="color: #3b82f6;">${productName}</strong> from your cart?</p>`,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#ef4444",
//       cancelButtonColor: "#94a3b8",
//       confirmButtonText: '<span style="font-weight: 600;">Yes, Remove It</span>',
//       cancelButtonText: '<span style="font-weight: 600;">Keep It</span>',
//       background: '#ffffff',
//       customClass: {
//         popup: 'rounded-3xl shadow-2xl border border-slate-200',
//         confirmButton: 'rounded-xl px-6 py-3 shadow-lg',
//         cancelButton: 'rounded-xl px-6 py-3'
//       },
//       buttonsStyling: true
//     }).then((result) => {
//       if (result.isConfirmed) {
//         removeFromCart(id);
//         setCartItems(getCartItems());
        
//         Swal.fire({
//           title: '<span style="color: #10b981; font-weight: 700;">Removed Successfully!</span>',
//           html: '<p style="color: #64748b;">Item has been removed from your cart</p>',
//           icon: "success",
//           timer: 2000,
//           showConfirmButton: false,
//           background: '#ffffff',
//           customClass: {
//             popup: 'rounded-3xl shadow-2xl'
//           }
//         });
//       }
//     });
//   };

//   const handleQuantityChange = (id: string, quantity: number) => {
//     if (quantity < 1) return;
//     updateCartQuantity(id, quantity);
//     setCartItems(getCartItems());
//   };

//   const calculateSubtotal = () => {
//     return cartItems.reduce((total, item) => total + item.price * item.inventory, 0);
//   };

//   const calculateTax = () => {
//     return calculateSubtotal() * 0.08;
//   };

//   const calculateTotal = () => {
//     return calculateSubtotal() + calculateTax();
//   };

//   const router = useRouter();

//   const handleProceed = () => {
//     Swal.fire({
//       title: '<span style="color: #1e293b; font-weight: 700;">Complete Your Order</span>',
//       html: `
//         <div style="text-align: left; padding: 16px; background: linear-gradient(to bottom right, #f0f9ff, #e0f2fe); border-radius: 16px; margin: 16px 0;">
//           <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
//             <div style="background: #10b981; padding: 8px; border-radius: 50%;">
//               <svg style="width: 20px; height: 20px; color: white;" fill="currentColor" viewBox="0 0 20 20">
//                 <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
//               </svg>
//             </div>
//             <span style="color: #0f172a; font-weight: 600;">Secure Payment Gateway</span>
//           </div>
//           <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
//             <div style="background: #10b981; padding: 8px; border-radius: 50%;">
//               <svg style="width: 20px; height: 20px; color: white;" fill="currentColor" viewBox="0 0 20 20">
//                 <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
//               </svg>
//             </div>
//             <span style="color: #0f172a; font-weight: 600;">Free Express Delivery</span>
//           </div>
//           <div style="display: flex; align-items: center; gap: 12px;">
//             <div style="background: #10b981; padding: 8px; border-radius: 50%;">
//               <svg style="width: 20px; height: 20px; color: white;" fill="currentColor" viewBox="0 0 20 20">
//                 <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
//               </svg>
//             </div>
//             <span style="color: #0f172a; font-weight: 600;">30-Day Money Back Guarantee</span>
//           </div>
//         </div>
//         <p style="color: #64748b; margin-top: 16px; font-size: 14px;">Total Amount: <strong style="color: #3b82f6; font-size: 18px;">$${calculateTotal().toFixed(2)}</strong></p>
//       `,
//       icon: "info",
//       showCancelButton: true,
//       confirmButtonColor: "#3b82f6",
//       cancelButtonColor: "#94a3b8",
//       confirmButtonText: '<span style="font-weight: 600;">Continue to Checkout →</span>',
//       cancelButtonText: '<span style="font-weight: 600;">Keep Shopping</span>',
//       reverseButtons: true,
//       background: '#ffffff',
//       customClass: {
//         popup: 'rounded-3xl shadow-2xl border border-slate-200',
//         confirmButton: 'rounded-xl px-8 py-3 shadow-lg',
//         cancelButton: 'rounded-xl px-8 py-3'
//       }
//     }).then((result) => {
//       if (result.isConfirmed) {
//         Swal.fire({
//           title: '<span style="color: #10b981; font-weight: 700;">Order Confirmed! 🎉</span>',
//           html: '<p style="color: #64748b;">Redirecting to secure checkout...</p>',
//           icon: "success",
//           timer: 1800,
//           showConfirmButton: false,
//           background: '#ffffff',
//           customClass: {
//             popup: 'rounded-3xl shadow-2xl'
//           }
//         });
//         setTimeout(() => {
//           router.push("/Checkout");
//         }, 1800);
//       }
//     });
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
//         <div className="relative">
//           <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
//           <FiShoppingCart className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-blue-600" />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
//       {/* Floating Background Elements */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
//         <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
//         <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
//       </div>

//       <div className="max-w-7xl mx-auto relative z-10">
//         {/* Header with Animation */}
//         <div className="mb-10 animate-slide-down">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center gap-4">
//               <div className="relative">
//                 <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-50"></div>
//                 <div className="relative p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-xl">
//                   <FiShoppingCart className="w-8 h-8 text-white" />
//                 </div>
//               </div>
//               <div>
//                 <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
//                   Shopping Cart
//                 </h1>
//                 <p className="text-slate-600 font-medium mt-1">
//                   {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} ready for checkout
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Trust Badges */}
//           <div className="flex flex-wrap gap-3 mt-6">
//             {[
//               { icon: FiShield, text: "Secure Checkout", color: "blue" },
//               { icon: FiTruck, text: "Free Shipping", color: "green" },
//               { icon: FiPercent, text: "Best Prices", color: "purple" }
//             ].map((badge, i) => (
//               <div key={i} className={`flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-${badge.color}-100 animate-fade-in`} style={{ animationDelay: `${i * 100}ms` }}>
//                 <badge.icon className={`w-4 h-4 text-${badge.color}-600`} />
//                 <span className="text-sm font-semibold text-slate-700">{badge.text}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {cartItems.length > 0 ? (
//           <div className="grid lg:grid-cols-3 gap-8">
//             {/* Cart Items */}
//             <div className="lg:col-span-2 space-y-4">
//               {cartItems.map((item, index) => (
//                 <div
//                   key={item._id}
//                   className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-transparent hover:border-blue-200 animate-slide-up"
//                   style={{ animationDelay: `${index * 100}ms` }}
//                 >
//                   {/* Gradient Border Effect on Hover */}
//                   <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"></div>
                  
//                   <div className="p-6 relative">
//                     <div className="flex gap-6">
//                       {/* Product Image with Badge */}
//                       {item.image && (
//                         <div className="relative flex-shrink-0">
//                           <div className="relative w-36 h-36 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 shadow-lg group-hover:scale-105 transition-transform duration-500">
//                             <Image
//                               src={urlFor(item.image).url()}
//                               fill
//                               alt={item.productName}
//                               className="object-cover"
//                             />
//                           </div>
//                           {/* Like Button */}
//                           <button
//                             onClick={() => toggleLike(item._id)}
//                             className="absolute -top-2 -right-2 p-2.5 bg-white rounded-full shadow-lg hover:scale-110 transition-transform duration-300"
//                           >
//                             <FiHeart 
//                               className={`w-5 h-5 transition-colors duration-300 ${
//                                 likedItems.has(item._id) ? 'fill-red-500 text-red-500' : 'text-slate-400'
//                               }`} 
//                             />
//                           </button>
//                           {/* Category Badge */}
//                           {item.category && (
//                             <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
//                               {item.category}
//                             </div>
//                           )}
//                         </div>
//                       )}

//                       {/* Product Details */}
//                       <div className="flex-1 flex flex-col min-w-0">
//                         <div className="flex justify-between items-start mb-3">
//                           <div className="flex-1 min-w-0 pr-4">
//                             <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-300 truncate">
//                               {item.productName}
//                             </h3>
//                             {/* Rating Stars */}
//                             <div className="flex items-center gap-1 mt-2">
//                               {[...Array(5)].map((_, i) => (
//                                 <FiStar key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
//                               ))}
//                               <span className="text-sm text-slate-500 ml-1">(4.9)</span>
//                             </div>
//                           </div>
//                           {/* Delete Button */}
//                           <button
//                             onClick={() => handleRemove(item._id, item.productName)}
//                             className="p-3 hover:bg-red-50 rounded-xl transition-all duration-300 group/del flex-shrink-0"
//                           >
//                             <FiTrash2 className="w-5 h-5 text-slate-400 group-hover/del:text-red-500 transition-colors" />
//                           </button>
//                         </div>

//                         {/* Price Badge */}
//                         <div className="mb-4">
//                           <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
//                             <span className="text-sm text-slate-600 font-medium">Unit Price:</span>
//                             <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                               ${item.price}
//                             </span>
//                           </div>
//                         </div>

//                         {/* Quantity & Subtotal */}
//                         <div className="mt-auto flex items-center justify-between">
//                           {/* Quantity Controls */}
//                           <div className="flex items-center gap-2">
//                             <span className="text-sm font-semibold text-slate-600">Qty:</span>
//                             <div className="flex items-center gap-1 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-1.5 border-2 border-slate-200 shadow-inner">
//                               <button
//                                 onClick={() => handleQuantityChange(item._id, item.inventory - 1)}
//                                 disabled={item.inventory <= 1}
//                                 className="p-2.5 hover:bg-white rounded-xl transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 shadow-sm"
//                               >
//                                 <FiMinus className="w-4 h-4 text-slate-700" />
//                               </button>
//                               <div className="px-6 py-2 bg-white rounded-xl shadow-sm">
//                                 <span className="font-black text-slate-900 text-lg">
//                                   {item.inventory}
//                                 </span>
//                               </div>
//                               <button
//                                 onClick={() => handleQuantityChange(item._id, item.inventory + 1)}
//                                 className="p-2.5 hover:bg-white rounded-xl transition-all duration-300 active:scale-95 shadow-sm"
//                               >
//                                 <FiPlus className="w-4 h-4 text-slate-700" />
//                               </button>
//                             </div>
//                           </div>

//                           {/* Item Subtotal */}
//                           <div className="text-right">
//                             <p className="text-xs text-slate-500 font-medium mb-1">Subtotal</p>
//                             <p className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                               ${(item.price * item.inventory).toFixed(2)}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Order Summary - Sticky */}
//             <div className="lg:col-span-1">
//               <div className="sticky top-8 space-y-6">
//                 {/* Main Summary Card */}
//                 <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-slate-100 overflow-hidden relative">
//                   {/* Background Decoration */}
//                   <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full -mr-20 -mt-20 opacity-50"></div>
                  
//                   <div className="relative">
//                     <div className="flex items-center gap-3 mb-6">
//                       <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg">
//                         <FiPackage className="w-6 h-6 text-white" />
//                       </div>
//                       <h2 className="text-2xl font-black text-slate-900">Order Summary</h2>
//                     </div>

//                     <div className="space-y-4 mb-6">
//                       <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
//                         <span className="text-slate-600 font-medium">Subtotal ({cartItems.length} items)</span>
//                         <span className="font-bold text-slate-900">${calculateSubtotal().toFixed(2)}</span>
//                       </div>
//                       <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl border border-green-100">
//                         <span className="text-green-700 font-medium flex items-center gap-2">
//                           <FiTruck className="w-4 h-4" />
//                           Shipping
//                         </span>
//                         <span className="font-bold text-green-600">FREE</span>
//                       </div>
//                       <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
//                         <span className="text-slate-600 font-medium">Tax (8%)</span>
//                         <span className="font-bold text-slate-900">${calculateTax().toFixed(2)}</span>
//                       </div>
                      
//                       {/* Total */}
//                       <div className="pt-4 border-t-2 border-slate-200">
//                         <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200">
//                           <span className="text-xl font-black text-slate-900">Total</span>
//                           <div className="text-right">
//                             <span className="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                               ${calculateTotal().toFixed(2)}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Checkout Button */}
//                     <button
//                       onClick={handleProceed}
//                       className="w-full relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white py-5 px-8 rounded-2xl font-black text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center gap-3 group overflow-hidden"
//                     >
//                       <span className="relative z-10">Proceed to Checkout</span>
//                       <FiArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
//                       {/* Animated background */}
//                       <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
//                     </button>
//                   </div>
//                 </div>

//                 {/* Trust Badges Card */}
//                 <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-3xl p-6 border-2 border-blue-100 shadow-lg">
//                   <h3 className="font-black text-slate-900 mb-4 text-lg">Why Shop With Us?</h3>
//                   <div className="space-y-3">
//                     {[
//                       { icon: FiShield, text: "100% Secure Payments", color: "blue" },
//                       { icon: FiTruck, text: "Free Express Delivery", color: "green" },
//                       { icon: FiPercent, text: "Best Price Guarantee", color: "purple" },
//                       { icon: FiStar, text: "Rated 4.9/5 by Customers", color: "yellow" }
//                     ].map((item, index) => (
//                       <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
//                         <div className={`p-2 bg-${item.color}-100 rounded-lg`}>
//                           <item.icon className={`w-5 h-5 text-${item.color}-600`} />
//                         </div>
//                         <span className="text-sm font-bold text-slate-700">{item.text}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ) : (
//           // Empty Cart State
//           <div className="max-w-2xl mx-auto text-center py-20 animate-fade-in">
//             <div className="bg-white rounded-3xl shadow-2xl p-16 border-2 border-slate-100 relative overflow-hidden">
//               {/* Background decoration */}
//               <div className="absolute inset-0 opacity-5">
//                 <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
//                 <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-500 rounded-full blur-3xl"></div>
//               </div>
              
//               <div className="relative">
//                 <div className="mb-8 inline-block">
//                   <div className="relative">
//                     <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-2xl opacity-30 animate-pulse"></div>
//                     <div className="relative p-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full">
//                       <FiShoppingCart className="w-20 h-20 text-slate-400" />
//                     </div>
//                   </div>
//                 </div>
//                 <h2 className="text-4xl font-black text-slate-900 mb-4">Your Cart is Empty</h2>
//                 <p className="text-slate-600 text-lg mb-10 max-w-md mx-auto">
//                   Looks like you haven't added anything to your cart yet. Start shopping to discover amazing products!
//                 </p>
//                 <button
//                   onClick={() => router.push("/")}
//                   className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white py-5 px-10 rounded-2xl font-black text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 group"
//                 >
//                   Start Shopping
//                   <FiArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       <style jsx>{`
//         @keyframes blob {
//           0%, 100% { transform: translate(0, 0) scale(1); }
//           25% { transform: translate(20px, -50px) scale(1.1); }
//           50% { transform: translate(-20px, 20px) scale(0.9); }
//           75% { transform: translate(50px, 50px) scale(1.05); }
//         }
//         .animate-blob {
//           animation: blob 10s infinite;
//         }
//         .animation-delay-2000 {
//           animation-delay: 2s;
//         }
//         .animation-delay-4000 {
//           animation-delay: 4s;
//         }
//         @keyframes slide-down {
//           from {
//             opacity: 0;
//             transform: translateY(-30px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-slide-down {
//           animation: slide-down 0.6s ease-out;
//         }
//         @keyframes slide-up {
//           from {
//             opacity: 0;
//             transform: translateY(30px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-slide-up {
//           animation: slide-up 0.5s ease-out forwards;
//           opacity: 0;
//         }
//         @keyframes fade-in {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         .animate-fade-in {
//           animation: fade-in 0.5s ease-out forwards;
//           opacity: 0;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default CartPage;

// "use client";

// import { Product } from "../../types/product";
// import React, { useEffect, useState } from "react";
// import {
//   getCartItems,
//   removeFromCart,
//   updateCartQuantity,
// } from "../../actions/actions";
// import Image from "next/image";
// import { urlFor } from "@/sanity/lib/image";
// import Swal from "sweetalert2";
// import { FiShoppingBag, FiTrash2, FiChevronUp, FiChevronDown } from "react-icons/fi";
// import { useRouter } from "next/navigation";

// const CartPage = () => {
//   const [cartItems, setCartItems] = useState<Product[]>([]);

//   useEffect(() => {
//     setCartItems(getCartItems());
//   }, []);

//   const handleRemove = (id: string) => {
//     Swal.fire({
//       title: "Remove Item?",
//       text: "This will remove the item from your cart",
//       icon: "question",
//       showCancelButton: true,
//       confirmButtonColor: "#ef4444",
//       cancelButtonColor: "#64748b",
//       confirmButtonText: "Remove",
//       backdrop: "rgba(241, 245, 249, 0.8)",
//       customClass: {
//         confirmButton: "hover:scale-105 transition-transform",
//         cancelButton: "hover:scale-105 transition-transform"
//       }
//     }).then((result) => {
//       if (result.isConfirmed) {
//         removeFromCart(id);
//         setCartItems(getCartItems());
//         Swal.fire({
//           title: "Removed!",
//           text: "Item has been removed from your cart",
//           icon: "success",
//           timer: 1500,
//           showConfirmButton: false,
//           background: "#fff",
//           backdrop: false
//         });
//       }
//     });
//   };

//   const handleQuantityChange = (id: string, quantity: number) => {
//     updateCartQuantity(id, quantity);
//     setCartItems(getCartItems());
//   };

//   const calculateTotal = () => {
//     return cartItems.reduce(
//       (total, item) => total + item.price * item.inventory,
//       0
//     );
//   };

//   const router = useRouter();

//   const handleProceed = () => {
//     Swal.fire({
//       title: "Ready to Checkout?",
//       text: "You'll be redirected to secure payment",
//       icon: "info",
//       showCancelButton: true,
//       confirmButtonColor: "#3b82f6",
//       cancelButtonColor: "#64748b",
//       confirmButtonText: "Continue to Payment",
//       reverseButtons: true,
//       customClass: {
//         confirmButton: "hover:scale-105 transition-transform",
//         cancelButton: "hover:scale-105 transition-transform"
//       }
//     }).then((result) => {
//       if (result.isConfirmed) {
//         Swal.fire(
//           "Success!",
//           "Your order has been successfully processed!",
//           "success"
//         );
//         router.push("/Checkout");
//         setCartItems([]);
//       }
//     });
//   };

//   return (
//     <div className="min-h-screen bg-slate-50/95 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-3xl mx-auto">
//         <div className="flex items-center gap-3 mb-8">
//           <FiShoppingBag className="w-8 h-8 text-blue-600" />
//           <h1 className="text-3xl font-bold text-slate-900">Your Cart</h1>
//         </div>

//         <div className="space-y-6">
//           {cartItems.length > 0 ? (
//             cartItems.map((item) => (
//               <div
//                 key={item._id}
//                 className="group bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ease-out border border-slate-100"
//               >
//                 <div className="flex gap-5">
//                   {item.image && (
//                     <div className="relative flex-shrink-0">
//                       <Image
//                         src={urlFor(item.image).url()}
//                         width={120}
//                         height={120}
//                         alt={item.productName}
//                         className="rounded-lg object-cover w-24 h-24"
//                       />
//                     </div>
//                   )}
//                   <div className="flex-1">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <h3 className="text-lg font-semibold text-slate-800">
//                           {item.productName}
//                         </h3>
//                         <p className="text-blue-600 font-medium mt-1">
//                           ${item.price}
//                         </p>
//                       </div>
//                       <button
//                         onClick={() => handleRemove(item._id)}
//                         className="text-slate-400 hover:text-red-500 transition-colors p-2 -mt-2 -mr-2"
//                       >
//                         <FiTrash2 className="w-5 h-5" />
//                       </button>
//                     </div>
                    
//                     <div className="flex items-center gap-4 mt-4">
//                       <div className="flex items-center gap-3 bg-slate-50 rounded-lg px-3 py-2">
//                         <button
//                           onClick={() => handleQuantityChange(item._id, item.inventory - 1)}
//                           disabled={item.inventory <= 1}
//                           className="text-slate-500 hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
//                         >
//                           <FiChevronDown className="w-5 h-5" />
//                         </button>
//                         <span className="font-medium text-slate-800 w-6 text-center">
//                           {item.inventory}
//                         </span>
//                         <button
//                           onClick={() => handleQuantityChange(item._id, item.inventory + 1)}
//                           className="text-slate-500 hover:text-blue-600 transition-colors"
//                         >
//                           <FiChevronUp className="w-5 h-5" />
//                         </button>
//                       </div>
//                       <div className="ml-auto">
//                         <p className="font-medium text-slate-800">
//                           ${(item.price * item.inventory).toFixed(2)}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="text-center py-12">
//               <div className="mb-4 text-slate-300">
//                 <FiShoppingBag className="w-16 h-16 mx-auto" />
//               </div>
//               <p className="text-slate-500 text-lg">Your cart is empty</p>
//             </div>
//           )}
//         </div>

//         {cartItems.length > 0 && (
//           <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-slate-100">
//             <div className="flex justify-between items-center mb-4">
//               <span className="text-slate-600">Subtotal</span>
//               <span className="font-bold text-slate-900 text-xl">
//                 ${calculateTotal().toFixed(2)}
//               </span>
//             </div>
//             <button
//               onClick={handleProceed}
//               className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 px-6 rounded-lg font-medium hover:scale-[1.02] transition-transform duration-200"
//             >
//               Proceed to Checkout
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CartPage;