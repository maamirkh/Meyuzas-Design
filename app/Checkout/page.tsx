'use client'
import React, { useEffect, useState } from 'react'
import { Product } from '../../types/product';
import { clearCart, getCartItems } from '../../actions/actions';
import { useCart } from '../context/CartContext'; // ✅ Add this import
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import { 
  FiShoppingBag, 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin,
  FiHome,
  FiCreditCard,
  FiLock,
  FiCheckCircle,
  FiTag,
  FiTruck,
  FiShield,
  FiArrowRight
} from 'react-icons/fi';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import Swal from 'sweetalert2';

const Checkout = () => {
    const { updateCartCount } = useCart(); // ✅ Add this line
    const [cartItems, setCartItems] = useState<Product[]>([]);
    const [discount, setDiscount] = useState<number>(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [formValues, setFormValues] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        zipCode: "",
        city: "",
    })
    const [formErrors, setFormErrors] = useState({
        firstName: false,
        lastName: false,
        email: false,
        phone: false,
        address: false,
        zipCode: false,
        city: false,
    });

    useEffect(() => {
        setCartItems(getCartItems())
        const appliedDiscount = localStorage.getItem("appliedDiscount")
        if (appliedDiscount) {
            setDiscount(Number(appliedDiscount))
        } 
    }, [])

    const subtotal = cartItems.reduce(
        (total, item) => total + item.price * item.inventory,
        0
    );
    const shipping = 0; // Free shipping
    const tax = subtotal * 0.08;
    const total = Math.max(subtotal - discount + tax, 0);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({
            ...formValues,
            [e.target.id]: e.target.value
        })
        // Clear error when user starts typing
        if (formErrors[e.target.id as keyof typeof formErrors]) {
            setFormErrors({
                ...formErrors,
                [e.target.id]: false
            })
        }
    }

    const validateForm = () => {
        const errors = {
            firstName: !formValues.firstName,
            lastName: !formValues.lastName,
            email: !formValues.email || !/\S+@\S+\.\S+/.test(formValues.email),
            phone: !formValues.phone,
            address: !formValues.address,
            zipCode: !formValues.zipCode,
            city: !formValues.city
        };
        setFormErrors(errors);
        return Object.values(errors).every((error) => !error);
    }

    const handlePlaceOrder = async () => {
        if (!validateForm()) {
            Swal.fire({
                title: '<span style="color: #ef4444; font-weight: 700;">Missing Information</span>',
                html: '<p style="color: #64748b;">Please fill in all required fields correctly.</p>',
                icon: "error",
                confirmButtonColor: "#ef4444",
                confirmButtonText: '<span style="font-weight: 600;">Got it</span>',
                customClass: {
                    popup: 'rounded-3xl shadow-2xl',
                    confirmButton: 'rounded-xl px-8 py-3'
                }
            });
            return;
        }

        Swal.fire({
            title: '<span style="color: #3b82f6; font-weight: 700;">Confirm Your Order</span>',
            html: `
                <div style="text-align: left; padding: 20px;">
                    <div style="background: linear-gradient(to bottom right, #eff6ff, #dbeafe); padding: 16px; border-radius: 16px; margin-bottom: 16px;">
                        <p style="color: #1e293b; margin: 8px 0;"><strong>Name:</strong> ${formValues.firstName} ${formValues.lastName}</p>
                        <p style="color: #1e293b; margin: 8px 0;"><strong>Email:</strong> ${formValues.email}</p>
                        <p style="color: #1e293b; margin: 8px 0;"><strong>Address:</strong> ${formValues.address}, ${formValues.city} ${formValues.zipCode}</p>
                    </div>
                    <div style="background: linear-gradient(to right, #f0fdf4, #dcfce7); padding: 16px; border-radius: 16px; border: 2px solid #86efac;">
                        <p style="color: #15803d; font-size: 18px; font-weight: 700; margin: 0;">Total Amount: $${total.toFixed(2)}</p>
                    </div>
                </div>
            `,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3b82f6",
            cancelButtonColor: "#94a3b8",
            confirmButtonText: '<span style="font-weight: 600;">Confirm & Pay →</span>',
            cancelButtonText: '<span style="font-weight: 600;">Review Again</span>',
            customClass: {
                popup: 'rounded-3xl shadow-2xl',
                confirmButton: 'rounded-xl px-8 py-3 shadow-lg',
                cancelButton: 'rounded-xl px-8 py-3'
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                setIsProcessing(true);

                const orderData = {
                    _type: 'order',
                    firstName: formValues.firstName,
                    lastName: formValues.lastName,
                    address: formValues.address,
                    city: formValues.city,
                    zipCode: formValues.zipCode,
                    phone: formValues.phone,
                    email: formValues.email,
                    cartItems: cartItems.map(item => ({
                        _type: 'reference',
                        _ref: item._id
                    })),
                    total: total,
                    discount: discount,
                    orderDate: new Date().toISOString()
                };

                try {
                    await client.create(orderData);
                    localStorage.removeItem("appliedDiscount");
                    clearCart();
                    setCartItems([]);
                    updateCartCount(); // ✅ Add this line - Reset counter to 0

                    Swal.fire({
                        title: '<span style="color: #10b981; font-weight: 700;">Order Confirmed! 🎉</span>',
                        html: `
                            <div style="text-align: center; padding: 20px;">
                                <div style="background: linear-gradient(to bottom right, #f0fdf4, #dcfce7); padding: 24px; border-radius: 20px; margin: 20px 0;">
                                    <p style="color: #15803d; font-size: 16px; margin: 8px 0;">Your order has been successfully placed!</p>
                                    <p style="color: #64748b; font-size: 14px; margin: 8px 0;">Order confirmation has been sent to ${formValues.email}</p>
                                </div>
                                <p style="color: #64748b; font-size: 14px;">We'll send you tracking information soon.</p>
                            </div>
                        `,
                        icon: "success",
                        confirmButtonColor: "#10b981",
                        confirmButtonText: '<span style="font-weight: 600;">Continue Shopping</span>',
                        customClass: {
                            popup: 'rounded-3xl shadow-2xl',
                            confirmButton: 'rounded-xl px-8 py-3'
                        }
                    }).then(() => {
                        window.location.href = '/';
                    });
                } catch (error) {
                    console.error("error creating order", error);
                    Swal.fire({
                        title: '<span style="color: #ef4444; font-weight: 700;">Order Failed</span>',
                        html: '<p style="color: #64748b;">Something went wrong. Please try again.</p>',
                        icon: "error",
                        confirmButtonColor: "#ef4444",
                        customClass: {
                            popup: 'rounded-3xl shadow-2xl'
                        }
                    });
                } finally {
                    setIsProcessing(false);
                }
            }
        });
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Floating Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            {/* Breadcrumb */}
            <div className="relative z-10 pt-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex items-center gap-2 py-4">
                        <Link
                            href="/Cart"
                            className="text-slate-600 hover:text-blue-600 transition font-medium text-sm flex items-center gap-2 group"
                        >
                            <FiShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            Cart
                        </Link>
                        <FiArrowRight className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Checkout
                        </span>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8 animate-slide-down">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-50"></div>
                            <div className="relative p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-xl">
                                <FiCreditCard className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Secure Checkout
                            </h1>
                            <p className="text-slate-600 font-medium mt-1">
                                Complete your order securely
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Billing Form - 2 columns */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Contact Information */}
                        <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-slate-100 animate-slide-up">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl">
                                    <FiUser className="w-6 h-6 text-blue-600" />
                                </div>
                                <h2 className="text-2xl font-black text-slate-900">Contact Information</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-bold text-slate-700 mb-2">
                                        First Name *
                                    </label>
                                    <div className="relative">
                                        <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                        <input
                                            id="firstName"
                                            type="text"
                                            placeholder="John"
                                            value={formValues.firstName}
                                            onChange={handleInputChange}
                                            className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-4 ${
                                                formErrors.firstName
                                                    ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                                                    : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                                            }`}
                                        />
                                    </div>
                                    {formErrors.firstName && (
                                        <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                                            <span>⚠️</span> First name is required
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-bold text-slate-700 mb-2">
                                        Last Name *
                                    </label>
                                    <div className="relative">
                                        <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                        <input
                                            id="lastName"
                                            type="text"
                                            placeholder="Doe"
                                            value={formValues.lastName}
                                            onChange={handleInputChange}
                                            className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-4 ${
                                                formErrors.lastName
                                                    ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                                                    : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                                            }`}
                                        />
                                    </div>
                                    {formErrors.lastName && (
                                        <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                                            <span>⚠️</span> Last name is required
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">
                                        Email Address *
                                    </label>
                                    <div className="relative">
                                        <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                        <input
                                            id="email"
                                            type="email"
                                            placeholder="john@example.com"
                                            value={formValues.email}
                                            onChange={handleInputChange}
                                            className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-4 ${
                                                formErrors.email
                                                    ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                                                    : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                                            }`}
                                        />
                                    </div>
                                    {formErrors.email && (
                                        <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                                            <span>⚠️</span> Valid email is required
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-bold text-slate-700 mb-2">
                                        Phone Number *
                                    </label>
                                    <div className="relative">
                                        <FiPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                        <input
                                            id="phone"
                                            type="tel"
                                            placeholder="+1 (555) 000-0000"
                                            value={formValues.phone}
                                            onChange={handleInputChange}
                                            className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-4 ${
                                                formErrors.phone
                                                    ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                                                    : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                                            }`}
                                        />
                                    </div>
                                    {formErrors.phone && (
                                        <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                                            <span>⚠️</span> Phone number is required
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-slate-100 animate-slide-up" style={{ animationDelay: '100ms' }}>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl">
                                    <FiMapPin className="w-6 h-6 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-black text-slate-900">Shipping Address</h2>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="address" className="block text-sm font-bold text-slate-700 mb-2">
                                        Street Address *
                                    </label>
                                    <div className="relative">
                                        <FiHome className="absolute left-4 top-4 text-slate-400 w-5 h-5" />
                                        <input
                                            id="address"
                                            type="text"
                                            placeholder="123 Main Street, Apt 4B"
                                            value={formValues.address}
                                            onChange={handleInputChange}
                                            className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-4 ${
                                                formErrors.address
                                                    ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                                                    : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                                            }`}
                                        />
                                    </div>
                                    {formErrors.address && (
                                        <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                                            <span>⚠️</span> Address is required
                                        </p>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="city" className="block text-sm font-bold text-slate-700 mb-2">
                                            City *
                                        </label>
                                        <div className="relative">
                                            <FiMapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                            <input
                                                id="city"
                                                type="text"
                                                placeholder="New York"
                                                value={formValues.city}
                                                onChange={handleInputChange}
                                                className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-4 ${
                                                    formErrors.city
                                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                                                        : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                                                }`}
                                            />
                                        </div>
                                        {formErrors.city && (
                                            <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                                                <span>⚠️</span> City is required
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor="zipCode" className="block text-sm font-bold text-slate-700 mb-2">
                                            Zip Code *
                                        </label>
                                        <div className="relative">
                                            <FiMapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                            <input
                                                id="zipCode"
                                                type="text"
                                                placeholder="10001"
                                                value={formValues.zipCode}
                                                onChange={handleInputChange}
                                                className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-4 ${
                                                    formErrors.zipCode
                                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                                                        : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                                                }`}
                                            />
                                        </div>
                                        {formErrors.zipCode && (
                                            <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                                                <span>⚠️</span> Zip code is required
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary - Sticky */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-6">
                            {/* Order Items */}
                            <div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-slate-100 animate-slide-up" style={{ animationDelay: '200ms' }}>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
                                        <FiShoppingBag className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <h2 className="text-xl font-black text-slate-900">Order Summary</h2>
                                </div>
                                <div className="space-y-4 max-h-64 overflow-y-auto custom-scrollbar">
                                    {cartItems.length > 0 ? (
                                        cartItems.map((item) => (
                                            <div
                                                key={item._id}
                                                className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                                            >
                                                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-white shadow-sm">
                                                    {item.image && (
                                                        <Image
                                                            src={urlFor(item.image).url()}
                                                            alt={item.productName}
                                                            width={64}
                                                            height={64}
                                                            className="object-cover w-full h-full"
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-sm font-bold text-slate-900 truncate">{item.productName}</h3>
                                                    <p className="text-xs text-slate-500 font-medium">
                                                        Qty: {item.inventory} × ${item.price}
                                                    </p>
                                                </div>
                                                <p className="text-sm font-black text-blue-600">
                                                    ${(item.price * item.inventory).toFixed(2)}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-slate-500 text-center py-8">Your cart is empty</p>
                                    )}
                                </div>
                            </div>

                            {/* Price Summary */}
                            <div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-slate-100 animate-slide-up" style={{ animationDelay: '300ms' }}>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-slate-600">
                                        <span className="font-medium">Subtotal</span>
                                        <span className="font-bold">${subtotal.toFixed(2)}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl border border-green-200">
                                            <span className="font-medium text-green-700 flex items-center gap-2">
                                                <FiTag className="w-4 h-4" />
                                                Discount
                                            </span>
                                            <span className="font-bold text-green-600">-${discount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl border border-blue-200">
                                        <span className="font-medium text-blue-700 flex items-center gap-2">
                                            <FiTruck className="w-4 h-4" />
                                            Shipping
                                        </span>
                                        <span className="font-bold text-blue-600">FREE</span>
                                    </div>
                                    <div className="flex justify-between items-center text-slate-600">
                                        <span className="font-medium">Tax (8%)</span>
                                        <span className="font-bold">${tax.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t-2 border-slate-200 pt-4">
                                        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200">
                                            <span className="text-xl font-black text-slate-900">Total</span>
                                            <span className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                                ${total.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Place Order Button */}
                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={isProcessing || cartItems.length === 0}
                                    className="w-full mt-6 relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white py-5 px-8 rounded-2xl font-black text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FiLock className="w-5 h-5" />
                                            <span>Place Secure Order</span>
                                            <FiArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                        </>
                                    )}
                                </button>

                                {/* Trust Badges */}
                                <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-500">
                                    <div className="flex items-center gap-1">
                                        <FiShield className="w-4 h-4 text-green-600" />
                                        <span className="font-semibold">Secure</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <FiCheckCircle className="w-4 h-4 text-blue-600" />
                                        <span className="font-semibold">Verified</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
                    from {
                        opacity: 0;
                        transform: translateY(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slide-down {
                    animation: slide-down 0.6s ease-out;
                }
                @keyframes slide-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slide-up {
                    animation: slide-up 0.5s ease-out forwards;
                    opacity: 0;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f5f9;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(to bottom, #2563eb, #7c3aed);
                }
            `}</style>
        </div>
    );
}

export default Checkout


// 'use client'
// import React, { useEffect, useState } from 'react'
// import { Product } from '../../types/product';
// import { clearCart, getCartItems } from '../../actions/actions';
// import Image from 'next/image';
// import { urlFor } from '@/sanity/lib/image';
// import { 
//   FiShoppingBag, 
//   FiUser, 
//   FiMail, 
//   FiPhone, 
//   FiMapPin,
//   FiHome,
//   FiCreditCard,
//   FiLock,
//   FiCheckCircle,
//   FiTag,
//   FiTruck,
//   FiShield,
//   FiArrowRight
// } from 'react-icons/fi';
// import Link from 'next/link';
// import { client } from '@/sanity/lib/client';
// import Swal from 'sweetalert2';

// const Checkout = () => {
//     const [cartItems, setCartItems] = useState<Product[]>([]);
//     const [discount, setDiscount] = useState<number>(0);
//     const [isProcessing, setIsProcessing] = useState(false);
//     const [formValues, setFormValues] = useState({
//         firstName: "",
//         lastName: "",
//         email: "",
//         phone: "",
//         address: "",
//         zipCode: "",
//         city: "",
//     })
//     const [formErrors, setFormErrors] = useState({
//         firstName: false,
//         lastName: false,
//         email: false,
//         phone: false,
//         address: false,
//         zipCode: false,
//         city: false,
//     });

//     useEffect(() => {
//         setCartItems(getCartItems())
//         const appliedDiscount = localStorage.getItem("appliedDiscount")
//         if (appliedDiscount) {
//             setDiscount(Number(appliedDiscount))
//         } 
//     }, [])

//     const subtotal = cartItems.reduce(
//         (total, item) => total + item.price * item.inventory,
//         0
//     );
//     const shipping = 0; // Free shipping
//     const tax = subtotal * 0.08;
//     const total = Math.max(subtotal - discount + tax, 0);

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setFormValues({
//             ...formValues,
//             [e.target.id]: e.target.value
//         })
//         // Clear error when user starts typing
//         if (formErrors[e.target.id as keyof typeof formErrors]) {
//             setFormErrors({
//                 ...formErrors,
//                 [e.target.id]: false
//             })
//         }
//     }

//     const validateForm = () => {
//         const errors = {
//             firstName: !formValues.firstName,
//             lastName: !formValues.lastName,
//             email: !formValues.email || !/\S+@\S+\.\S+/.test(formValues.email),
//             phone: !formValues.phone,
//             address: !formValues.address,
//             zipCode: !formValues.zipCode,
//             city: !formValues.city
//         };
//         setFormErrors(errors);
//         return Object.values(errors).every((error) => !error);
//     }

//     const handlePlaceOrder = async () => {
//         if (!validateForm()) {
//             Swal.fire({
//                 title: '<span style="color: #ef4444; font-weight: 700;">Missing Information</span>',
//                 html: '<p style="color: #64748b;">Please fill in all required fields correctly.</p>',
//                 icon: "error",
//                 confirmButtonColor: "#ef4444",
//                 confirmButtonText: '<span style="font-weight: 600;">Got it</span>',
//                 customClass: {
//                     popup: 'rounded-3xl shadow-2xl',
//                     confirmButton: 'rounded-xl px-8 py-3'
//                 }
//             });
//             return;
//         }

//         Swal.fire({
//             title: '<span style="color: #3b82f6; font-weight: 700;">Confirm Your Order</span>',
//             html: `
//                 <div style="text-align: left; padding: 20px;">
//                     <div style="background: linear-gradient(to bottom right, #eff6ff, #dbeafe); padding: 16px; border-radius: 16px; margin-bottom: 16px;">
//                         <p style="color: #1e293b; margin: 8px 0;"><strong>Name:</strong> ${formValues.firstName} ${formValues.lastName}</p>
//                         <p style="color: #1e293b; margin: 8px 0;"><strong>Email:</strong> ${formValues.email}</p>
//                         <p style="color: #1e293b; margin: 8px 0;"><strong>Address:</strong> ${formValues.address}, ${formValues.city} ${formValues.zipCode}</p>
//                     </div>
//                     <div style="background: linear-gradient(to right, #f0fdf4, #dcfce7); padding: 16px; border-radius: 16px; border: 2px solid #86efac;">
//                         <p style="color: #15803d; font-size: 18px; font-weight: 700; margin: 0;">Total Amount: $${total.toFixed(2)}</p>
//                     </div>
//                 </div>
//             `,
//             icon: "question",
//             showCancelButton: true,
//             confirmButtonColor: "#3b82f6",
//             cancelButtonColor: "#94a3b8",
//             confirmButtonText: '<span style="font-weight: 600;">Confirm & Pay →</span>',
//             cancelButtonText: '<span style="font-weight: 600;">Review Again</span>',
//             customClass: {
//                 popup: 'rounded-3xl shadow-2xl',
//                 confirmButton: 'rounded-xl px-8 py-3 shadow-lg',
//                 cancelButton: 'rounded-xl px-8 py-3'
//             }
//         }).then(async (result) => {
//             if (result.isConfirmed) {
//                 setIsProcessing(true);

//                 const orderData = {
//                     _type: 'order',
//                     firstName: formValues.firstName,
//                     lastName: formValues.lastName,
//                     address: formValues.address,
//                     city: formValues.city,
//                     zipCode: formValues.zipCode,
//                     phone: formValues.phone,
//                     email: formValues.email,
//                     cartItems: cartItems.map(item => ({
//                         _type: 'reference',
//                         _ref: item._id
//                     })),
//                     total: total,
//                     discount: discount,
//                     orderDate: new Date().toISOString()
//                 };

//                 try {
//                     await client.create(orderData);
//                     localStorage.removeItem("appliedDiscount");
//                     clearCart();
//                     setCartItems([]);

//                     Swal.fire({
//                         title: '<span style="color: #10b981; font-weight: 700;">Order Confirmed! 🎉</span>',
//                         html: `
//                             <div style="text-align: center; padding: 20px;">
//                                 <div style="background: linear-gradient(to bottom right, #f0fdf4, #dcfce7); padding: 24px; border-radius: 20px; margin: 20px 0;">
//                                     <p style="color: #15803d; font-size: 16px; margin: 8px 0;">Your order has been successfully placed!</p>
//                                     <p style="color: #64748b; font-size: 14px; margin: 8px 0;">Order confirmation has been sent to ${formValues.email}</p>
//                                 </div>
//                                 <p style="color: #64748b; font-size: 14px;">We'll send you tracking information soon.</p>
//                             </div>
//                         `,
//                         icon: "success",
//                         confirmButtonColor: "#10b981",
//                         confirmButtonText: '<span style="font-weight: 600;">Continue Shopping</span>',
//                         customClass: {
//                             popup: 'rounded-3xl shadow-2xl',
//                             confirmButton: 'rounded-xl px-8 py-3'
//                         }
//                     }).then(() => {
//                         window.location.href = '/';
//                     });
//                 } catch (error) {
//                     console.error("error creating order", error);
//                     Swal.fire({
//                         title: '<span style="color: #ef4444; font-weight: 700;">Order Failed</span>',
//                         html: '<p style="color: #64748b;">Something went wrong. Please try again.</p>',
//                         icon: "error",
//                         confirmButtonColor: "#ef4444",
//                         customClass: {
//                             popup: 'rounded-3xl shadow-2xl'
//                         }
//                     });
//                 } finally {
//                     setIsProcessing(false);
//                 }
//             }
//         });
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
//             {/* Floating Background */}
//             <div className="fixed inset-0 overflow-hidden pointer-events-none">
//                 <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
//                 <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
//                 <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
//             </div>

//             {/* Breadcrumb */}
//             <div className="relative z-10 pt-6">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <nav className="flex items-center gap-2 py-4">
//                         <Link
//                             href="/Cart"
//                             className="text-slate-600 hover:text-blue-600 transition font-medium text-sm flex items-center gap-2 group"
//                         >
//                             <FiShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
//                             Cart
//                         </Link>
//                         <FiArrowRight className="w-4 h-4 text-slate-400" />
//                         <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                             Checkout
//                         </span>
//                     </nav>
//                 </div>
//             </div>

//             {/* Main Content */}
//             <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//                 {/* Header */}
//                 <div className="mb-8 animate-slide-down">
//                     <div className="flex items-center gap-4 mb-2">
//                         <div className="relative">
//                             <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-50"></div>
//                             <div className="relative p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-xl">
//                                 <FiCreditCard className="w-8 h-8 text-white" />
//                             </div>
//                         </div>
//                         <div>
//                             <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
//                                 Secure Checkout
//                             </h1>
//                             <p className="text-slate-600 font-medium mt-1">
//                                 Complete your order securely
//                             </p>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                     {/* Billing Form - 2 columns */}
//                     <div className="lg:col-span-2 space-y-6">
//                         {/* Contact Information */}
//                         <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-slate-100 animate-slide-up">
//                             <div className="flex items-center gap-3 mb-6">
//                                 <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl">
//                                     <FiUser className="w-6 h-6 text-blue-600" />
//                                 </div>
//                                 <h2 className="text-2xl font-black text-slate-900">Contact Information</h2>
//                             </div>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                 <div>
//                                     <label htmlFor="firstName" className="block text-sm font-bold text-slate-700 mb-2">
//                                         First Name *
//                                     </label>
//                                     <div className="relative">
//                                         <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
//                                         <input
//                                             id="firstName"
//                                             type="text"
//                                             placeholder="John"
//                                             value={formValues.firstName}
//                                             onChange={handleInputChange}
//                                             className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-4 ${
//                                                 formErrors.firstName
//                                                     ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
//                                                     : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
//                                             }`}
//                                         />
//                                     </div>
//                                     {formErrors.firstName && (
//                                         <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
//                                             <span>⚠️</span> First name is required
//                                         </p>
//                                     )}
//                                 </div>
//                                 <div>
//                                     <label htmlFor="lastName" className="block text-sm font-bold text-slate-700 mb-2">
//                                         Last Name *
//                                     </label>
//                                     <div className="relative">
//                                         <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
//                                         <input
//                                             id="lastName"
//                                             type="text"
//                                             placeholder="Doe"
//                                             value={formValues.lastName}
//                                             onChange={handleInputChange}
//                                             className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-4 ${
//                                                 formErrors.lastName
//                                                     ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
//                                                     : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
//                                             }`}
//                                         />
//                                     </div>
//                                     {formErrors.lastName && (
//                                         <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
//                                             <span>⚠️</span> Last name is required
//                                         </p>
//                                     )}
//                                 </div>
//                                 <div>
//                                     <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">
//                                         Email Address *
//                                     </label>
//                                     <div className="relative">
//                                         <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
//                                         <input
//                                             id="email"
//                                             type="email"
//                                             placeholder="john@example.com"
//                                             value={formValues.email}
//                                             onChange={handleInputChange}
//                                             className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-4 ${
//                                                 formErrors.email
//                                                     ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
//                                                     : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
//                                             }`}
//                                         />
//                                     </div>
//                                     {formErrors.email && (
//                                         <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
//                                             <span>⚠️</span> Valid email is required
//                                         </p>
//                                     )}
//                                 </div>
//                                 <div>
//                                     <label htmlFor="phone" className="block text-sm font-bold text-slate-700 mb-2">
//                                         Phone Number *
//                                     </label>
//                                     <div className="relative">
//                                         <FiPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
//                                         <input
//                                             id="phone"
//                                             type="tel"
//                                             placeholder="+1 (555) 000-0000"
//                                             value={formValues.phone}
//                                             onChange={handleInputChange}
//                                             className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-4 ${
//                                                 formErrors.phone
//                                                     ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
//                                                     : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
//                                             }`}
//                                         />
//                                     </div>
//                                     {formErrors.phone && (
//                                         <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
//                                             <span>⚠️</span> Phone number is required
//                                         </p>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Shipping Address */}
//                         <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-slate-100 animate-slide-up" style={{ animationDelay: '100ms' }}>
//                             <div className="flex items-center gap-3 mb-6">
//                                 <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl">
//                                     <FiMapPin className="w-6 h-6 text-green-600" />
//                                 </div>
//                                 <h2 className="text-2xl font-black text-slate-900">Shipping Address</h2>
//                             </div>
//                             <div className="space-y-6">
//                                 <div>
//                                     <label htmlFor="address" className="block text-sm font-bold text-slate-700 mb-2">
//                                         Street Address *
//                                     </label>
//                                     <div className="relative">
//                                         <FiHome className="absolute left-4 top-4 text-slate-400 w-5 h-5" />
//                                         <input
//                                             id="address"
//                                             type="text"
//                                             placeholder="123 Main Street, Apt 4B"
//                                             value={formValues.address}
//                                             onChange={handleInputChange}
//                                             className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-4 ${
//                                                 formErrors.address
//                                                     ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
//                                                     : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
//                                             }`}
//                                         />
//                                     </div>
//                                     {formErrors.address && (
//                                         <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
//                                             <span>⚠️</span> Address is required
//                                         </p>
//                                     )}
//                                 </div>
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                     <div>
//                                         <label htmlFor="city" className="block text-sm font-bold text-slate-700 mb-2">
//                                             City *
//                                         </label>
//                                         <div className="relative">
//                                             <FiMapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
//                                             <input
//                                                 id="city"
//                                                 type="text"
//                                                 placeholder="New York"
//                                                 value={formValues.city}
//                                                 onChange={handleInputChange}
//                                                 className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-4 ${
//                                                     formErrors.city
//                                                         ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
//                                                         : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
//                                                 }`}
//                                             />
//                                         </div>
//                                         {formErrors.city && (
//                                             <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
//                                                 <span>⚠️</span> City is required
//                                             </p>
//                                         )}
//                                     </div>
//                                     <div>
//                                         <label htmlFor="zipCode" className="block text-sm font-bold text-slate-700 mb-2">
//                                             Zip Code *
//                                         </label>
//                                         <div className="relative">
//                                             <FiMapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
//                                             <input
//                                                 id="zipCode"
//                                                 type="text"
//                                                 placeholder="10001"
//                                                 value={formValues.zipCode}
//                                                 onChange={handleInputChange}
//                                                 className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-4 ${
//                                                     formErrors.zipCode
//                                                         ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
//                                                         : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
//                                                 }`}
//                                             />
//                                         </div>
//                                         {formErrors.zipCode && (
//                                             <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
//                                                 <span>⚠️</span> Zip code is required
//                                             </p>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Order Summary - Sticky */}
//                     <div className="lg:col-span-1">
//                         <div className="sticky top-8 space-y-6">
//                             {/* Order Items */}
//                             <div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-slate-100 animate-slide-up" style={{ animationDelay: '200ms' }}>
//                                 <div className="flex items-center gap-3 mb-6">
//                                     <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
//                                         <FiShoppingBag className="w-6 h-6 text-purple-600" />
//                                     </div>
//                                     <h2 className="text-xl font-black text-slate-900">Order Summary</h2>
//                                 </div>
//                                 <div className="space-y-4 max-h-64 overflow-y-auto custom-scrollbar">
//                                     {cartItems.length > 0 ? (
//                                         cartItems.map((item) => (
//                                             <div
//                                                 key={item._id}
//                                                 className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
//                                             >
//                                                 <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-white shadow-sm">
//                                                     {item.image && (
//                                                         <Image
//                                                             src={urlFor(item.image).url()}
//                                                             alt={item.productName}
//                                                             width={64}
//                                                             height={64}
//                                                             className="object-cover w-full h-full"
//                                                         />
//                                                     )}
//                                                 </div>
//                                                 <div className="flex-1 min-w-0">
//                                                     <h3 className="text-sm font-bold text-slate-900 truncate">{item.productName}</h3>
//                                                     <p className="text-xs text-slate-500 font-medium">
//                                                         Qty: {item.inventory} × ${item.price}
//                                                     </p>
//                                                 </div>
//                                                 <p className="text-sm font-black text-blue-600">
//                                                     ${(item.price * item.inventory).toFixed(2)}
//                                                 </p>
//                                             </div>
//                                         ))
//                                     ) : (
//                                         <p className="text-sm text-slate-500 text-center py-8">Your cart is empty</p>
//                                     )}
//                                 </div>
//                             </div>

//                             {/* Price Summary */}
//                             <div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-slate-100 animate-slide-up" style={{ animationDelay: '300ms' }}>
//                                 <div className="space-y-4">
//                                     <div className="flex justify-between items-center text-slate-600">
//                                         <span className="font-medium">Subtotal</span>
//                                         <span className="font-bold">${subtotal.toFixed(2)}</span>
//                                     </div>
//                                     {discount > 0 && (
//                                         <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl border border-green-200">
//                                             <span className="font-medium text-green-700 flex items-center gap-2">
//                                                 <FiTag className="w-4 h-4" />
//                                                 Discount
//                                             </span>
//                                             <span className="font-bold text-green-600">-${discount.toFixed(2)}</span>
//                                         </div>
//                                     )}
//                                     <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl border border-blue-200">
//                                         <span className="font-medium text-blue-700 flex items-center gap-2">
//                                             <FiTruck className="w-4 h-4" />
//                                             Shipping
//                                         </span>
//                                         <span className="font-bold text-blue-600">FREE</span>
//                                     </div>
//                                     <div className="flex justify-between items-center text-slate-600">
//                                         <span className="font-medium">Tax (8%)</span>
//                                         <span className="font-bold">${tax.toFixed(2)}</span>
//                                     </div>
//                                     <div className="border-t-2 border-slate-200 pt-4">
//                                         <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200">
//                                             <span className="text-xl font-black text-slate-900">Total</span>
//                                             <span className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                                                 ${total.toFixed(2)}
//                                             </span>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Place Order Button */}
//                                 <button
//                                     onClick={handlePlaceOrder}
//                                     disabled={isProcessing || cartItems.length === 0}
//                                     className="w-full mt-6 relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white py-5 px-8 rounded-2xl font-black text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
//                                 >
//                                     {isProcessing ? (
//                                         <>
//                                             <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                                             <span>Processing...</span>
//                                         </>
//                                     ) : (
//                                         <>
//                                             <FiLock className="w-5 h-5" />
//                                             <span>Place Secure Order</span>
//                                             <FiArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
//                                         </>
//                                     )}
//                                 </button>

//                                 {/* Trust Badges */}
//                                 <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-500">
//                                     <div className="flex items-center gap-1">
//                                         <FiShield className="w-4 h-4 text-green-600" />
//                                         <span className="font-semibold">Secure</span>
//                                     </div>
//                                     <div className="flex items-center gap-1">
//                                         <FiCheckCircle className="w-4 h-4 text-blue-600" />
//                                         <span className="font-semibold">Verified</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <style jsx>{`
//                 @keyframes blob {
//                     0%, 100% { transform: translate(0, 0) scale(1); }
//                     25% { transform: translate(20px, -50px) scale(1.1); }
//                     50% { transform: translate(-20px, 20px) scale(0.9); }
//                     75% { transform: translate(50px, 50px) scale(1.05); }
//                 }
//                 .animate-blob {
//                     animation: blob 10s infinite;
//                 }
//                 .animation-delay-2000 {
//                     animation-delay: 2s;
//                 }
//                 .animation-delay-4000 {
//                     animation-delay: 4s;
//                 }
//                 @keyframes slide-down {
//                     from {
//                         opacity: 0;
//                         transform: translateY(-30px);
//                     }
//                     to {
//                         opacity: 1;
//                         transform: translateY(0);
//                     }
//                 }
//                 .animate-slide-down {
//                     animation: slide-down 0.6s ease-out;
//                 }
//                 @keyframes slide-up {
//                     from {
//                         opacity: 0;
//                         transform: translateY(30px);
//                     }
//                     to {
//                         opacity: 1;
//                         transform: translateY(0);
//                     }
//                 }
//                 .animate-slide-up {
//                     animation: slide-up 0.5s ease-out forwards;
//                     opacity: 0;
//                 }
//                 .custom-scrollbar::-webkit-scrollbar {
//                     width: 6px;
//                 }
//                 .custom-scrollbar::-webkit-scrollbar-track {
//                     background: #f1f5f9;
//                     border-radius: 10px;
//                 }
//                 .custom-scrollbar::-webkit-scrollbar-thumb {
//                     background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
//                     border-radius: 10px;
//                 }
//                 .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//                     background: linear-gradient(to bottom, #2563eb, #7c3aed);
//                 }
//             `}</style>
//         </div>
//     );
// }

// export default Checkout


// 'use client'
// import React, { useEffect, useState } from 'react'
// import { Product } from '../../types/product';
// import { clearCart, getCartItems } from '../../actions/actions';
// import Image from 'next/image';
// import { urlFor } from '@/sanity/lib/image';
// import {CgChevronRight} from 'react-icons/cg';
// import Link from 'next/link';
// import { client } from '@/sanity/lib/client';
// import Swal from 'sweetalert2';


// const Checkout = () => {

//     const [cartItems, setCartItems] = useState<Product[]>([]);
//     const [discount, setDiscount] = useState<number>(0);
//     const [formValues, setFormValues] = useState({
//         firstName: "",
//         lastName: "",
//         email: "",
//         phone: "",
//         address: "",
//         zipCode: "",
//         city: "",
        
//     })
//     const [formErrors, setFormErrors] = useState({
//         firstName: false,
//         lastName: false,
//         email: false,
//         phone: false,
//         address: false,
//         zipCode: false,
//         city: false,
//     });
//     useEffect (() => {
//         setCartItems(getCartItems())
//         const appliedDiscount = localStorage.getItem("appliedDiscount")
//         if (appliedDiscount) {
//             setDiscount(Number(appliedDiscount))
//         } 
//     },[])

//     const subtotal = cartItems.reduce(
//         (total, item) => total + item.price * item.inventory,
//         0
//       );
//       const total = Math.max(subtotal - discount, 0);

    
//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setFormValues({
//             ...formValues,
//             [e.target.id]: e.target.value
//         })
//     }
//     const validateForm = () => {
//         const errors = {
//             firstName : !formValues.firstName,
//             lastName : !formValues.lastName,
//             email : !formValues.email,
//             phone : !formValues.phone,
//             address : !formValues.address,
//             zipCode : !formValues.zipCode,
//             city : !formValues.city
                      
//         };
//         setFormErrors(errors);
//         return Object.values(errors).every((error) => !error);
//     }
//     const handlePlaceOrder = async () => {

//       Swal.fire({
//         title: 'Processing your order...',
//         text: 'Please wait a moment.',
//         icon: 'info',
//         showCancelButton: true,
//         confirmButtonColor: '#3085d6',
//         cancelButtonColor: '#d33',
//         confirmButtonText: 'Proceed',
//         }).then(async (result) => {
//           if (result.isConfirmed) {
//             if (validateForm()){
//               localStorage.removeItem("appliedDiscount");
//               Swal.fire(
//                 "Success",
//                 "Your order has been placed successfully.",
//                 "success"

//               );
            

//             } else {
//               Swal.fire(
//                 "Error",
//                 "Please fill in all the required fields.",
//                 "error"
//               )
            
//             }
//           }
//       })
//         const orderData = {
//             _type : 'order',
//             firstName : formValues.firstName,
//             lastName : formValues.lastName,
//             address: formValues.address,
//             city : formValues.city,
//             zipCode : formValues.zipCode,
//             phone : formValues.phone,
//             email : formValues.email,
//             cartItems : cartItems.map(item => ({
//                 _type : 'reference',
//                 _ref : item._id
//             })),
//             total : total,
//             discount : discount,
//             orderDate : new Date().toISOString()
//         };

//         try {
//             await client.create(orderData)
//             localStorage.removeItem("appliedDiscount");
//             clearCart();          // ✅ LocalStorage se cart clear
//           setCartItems([]);

//           localStorage.removeItem("appliedDiscount");
//               Swal.fire(
//                 "Success",
//                 "Your order has been placed successfully.",
//                 "success"
//               )
//         } catch (error) {
//             console.error("error creating order", error)
//         }
//         if (validateForm()) {
//             localStorage.removeItem("applliedDiscount")
//         }
//     }
//       return (
//         <div className={`min-h-screen bg-gray-50`}>
//         {/* Breadcrumb */}
//         <div className="mt-6">
//           <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//             <nav className="flex items-center gap-2 py-4">
//               <Link
//                 href="/cart"
//                 className="text-[#666666] hover:text-black transition text-sm"
//               >
//                 Cart
//               </Link>
//               <CgChevronRight className="w-4 h-4 text-[#666666]" />
//               <span className="text-sm">Checkout</span>
//             </nav>
//           </div>
//         </div>
  
//         {/* Main Content */}
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             {/* Order Summary */}
//             <div className="bg-white border rounded-lg p-6 space-y-4">
//               <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
//               {cartItems.length > 0 ? (
//                 cartItems.map((item) => (
//                   <div
//                     key={item._id}
//                     className="flex items-center gap-4 py-3 border-b"
//                   >
//                     <div className="w-16 h-16 rounded overflow-hidden">
//                       {item.image && (
//                         <Image
//                           src={urlFor(item.image).url()}
//                           alt={item.productName}
//                           width={64}
//                           height={64}
//                           className="object-cover w-full h-full"
//                         />
//                       )}
//                     </div>
//                     <div className="flex-1">
//                       <h3 className="text-sm font-medium">{item.productName}</h3>
//                       <p className="text-xs text-gray-500">
//                         Quantity: {item.inventory}
//                       </p>
//                     </div>
//                     <p className="text-sm font-medium">
//                       ${item.price * item.inventory}
//                     </p>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-sm text-gray-500">Your cart is empty.</p>
//               )}
//               <div className="text-right pt-4">
//                 <p className="text-sm">
//                   Subtotal: <span className="font-medium">${subtotal}</span>
//                 </p>
//                 <p className="text-sm">
//                   Discount: <span className="font-medium">-${discount}</span>
//                 </p>
//                 <p className="text-lg font-semibold">
//                   Total: ${total.toFixed(2)}
//                 </p>
//               </div>
//             </div>
  
//             {/* Billing Form */}
//             <div className="bg-white border rounded-lg p-6 space-y-6">
//               <h2 className="text-xl font-semibold">Billing Information</h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div>
//                   <label htmlFor="firstName">First Name</label>
//                   <input
//                     id="firstName"
//                     placeholder="Enter your first name"
//                     value={formValues.firstName}
//                     onChange={handleInputChange}
//                     className="border"
//                   />
//                   {formErrors.firstName && (
//                     <p className="text-sm text-red-500">
//                       First name is required.
//                     </p>
//                   )}
//                 </div>
//                 <div>
//                   <label htmlFor="lastName">Last Name </label>
//                   <input
//                     id="lastName"
//                     placeholder="Enter your last name"
//                     value={formValues.lastName}
//                     onChange={handleInputChange}
//                   />
//                   {formErrors.lastName && (
//                     <p className="text-sm text-red-500">
//                       Last name is required.
//                     </p>
//                   )}
//                 </div>
//               </div>
//               <div className='flex flex-col gap-4 items-start'>
//               <div>
//                 <label htmlFor="address">Address </label>
//                 <input
//                   id="address"
//                   placeholder="Enter your address"
//                   value={formValues.address}
//                   onChange={handleInputChange}
//                 />
//                 {formErrors.address && (
//                   <p className="text-sm text-red-500">Address is required.</p>
//                 )}
//               </div>
//               <div>
//                 <label htmlFor="city">City </label>
//                 <input
//                   id="city"
//                   placeholder="Enter your city"
//                   value={formValues.city}
//                   onChange={handleInputChange}
//                 />
//                 {formErrors.city && (
//                   <p className="text-sm text-red-500">City is required.</p>
//                 )}
//               </div>
//               <div>
//                 <label htmlFor="zipCode">Zip Code </label>
//                 <input
//                   id="zipCode"
//                   placeholder="Enter your zip code"
//                   value={formValues.zipCode}
//                   onChange={handleInputChange}
//                 />
//                 {formErrors.zipCode && (
//                   <p className="text-sm text-red-500">Zip Code is required.</p>
//                 )}
//               </div>
//               <div>
//                 <label htmlFor="phone">Phone </label>
//                 <input
//                   id="phone"
//                   placeholder="Enter your phone number"
//                   value={formValues.phone}
//                   onChange={handleInputChange}
//                 />
//                 {formErrors.phone && (
//                   <p className="text-sm text-red-500">Phone is required.</p>
//                 )}
//               </div>
//               <div>
//                 <label htmlFor="email">Email </label>
//                 <input
//                   id="email"
//                   placeholder="Enter your email address"
//                   value={formValues.email}
//                   onChange={handleInputChange}
//                 />
//                 {formErrors.email && (
//                   <p className="text-sm text-red-500">Email is required.</p>
//                 )}
//               </div>
//               </div>
//               <button
//                 className="w-full h-12 bg-blue-500 hover:bg-blue-700 text-white"
//                 onClick={handlePlaceOrder}
//               >
//                 Place Order
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
  


// export default Checkout