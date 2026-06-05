'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';

interface OrderDetails {
  _id: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  totalAmount: number;
  orderItems: Array<{
    _key: string;
    quantity: number;
    price: number;
    discountedPrice?: number;
    product: {
      productName: string;
      image: any;
    };
  }>;
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      const fetchOrder = async () => {
        try {
          const data = await client.fetch(
            `*[_type == "order" && _id == $orderId][0] {
              _id,
              customerName,
              email,
              phone,
              address,
              city,
              paymentMethod,
              subtotal,
              shipping,
              totalAmount,
              orderItems[] {
                _key,
                quantity,
                price,
                discountedPrice,
                product-> {
                  productName,
                  image
                }
              }
            }`,
            { orderId }
          );
          setOrder(data);
        } catch (error) {
          console.error("Error fetching order:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    } else {
      setLoading(false);
    }
  }, [orderId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#9ECFD4] via-[#78B9B5] to-[#016B61]/20 p-4 py-12 flex flex-col items-center">
      <div className="max-w-3xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-[#9ECFD4] mb-8">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-[#9ECFD4] via-[#78B9B5] to-[#016B61] p-10 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-8 h-8 text-[#016B61]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-1">Order Confirmed!</h1>
            <p className="text-white/90 font-medium">Thank you for shopping with Meyuza&apos;s Designs</p>
          </div>

          <div className="p-6 sm:p-10">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#78B9B5] border-t-transparent mb-4"></div>
                <p className="text-[#016B61] font-medium">Generating your invoice...</p>
              </div>
            ) : order ? (
              <div className="space-y-8">
                {/* Invoice ID & Details */}
                <div className="flex flex-col sm:flex-row justify-between gap-4 border-b-2 border-[#9ECFD4]/20 pb-6">
                  <div>
                    <h2 className="text-lg font-bold text-[#016B61] uppercase tracking-wider mb-1">Invoice Details</h2>
                    <p className="text-sm text-gray-600">Order ID: <span className="font-mono font-bold text-[#016B61]">{order._id}</span></p>
                    <p className="text-sm text-gray-600">Date: {new Date().toLocaleDateString()}</p>
                  </div>
                  <div className="sm:text-right">
                    <h2 className="text-lg font-bold text-[#016B61] uppercase tracking-wider mb-1">Customer</h2>
                    <p className="font-bold text-gray-800">{order.customerName}</p>
                    <p className="text-sm text-gray-600">{order.phone}</p>
                    <p className="text-sm text-gray-600">{order.email}</p>
                  </div>
                </div>

                {/* Shipping info */}
                <div className="bg-[#9ECFD4]/10 p-4 rounded-xl border border-[#9ECFD4]/30">
                   <h3 className="font-bold text-[#016B61] mb-2 flex items-center gap-2">
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                     </svg>
                     Shipping Address
                   </h3>
                   <p className="text-gray-700">{order.address}</p>
                   <p className="text-gray-700">{order.city}</p>
                   <p className="mt-2 text-sm font-bold text-[#016B61]">Payment Method: <span className="uppercase">{order.paymentMethod}</span></p>
                </div>

                {/* Order Items Table */}
                <div>
                  <h3 className="font-bold text-[#016B61] mb-4">Ordered Items</h3>
                  <div className="space-y-4">
                    {order.orderItems.map((item) => {
                      const priceToUse = item.discountedPrice !== undefined ? item.discountedPrice : item.price;
                      return (
                        <div key={item._key} className="flex items-center gap-4 py-2 border-b border-gray-100 last:border-0">
                          <div className="w-16 h-16 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                             {item.product.image && (
                               <Image 
                                 src={urlFor(item.product.image).width(100).height(100).url()} 
                                 alt={item.product.productName} 
                                 width={64} 
                                 height={64} 
                                 className="w-full h-full object-cover"
                               />
                             )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-800 truncate">{item.product.productName}</h4>
                            <p className="text-sm text-gray-500">Qty: {item.quantity} × Rs. {priceToUse.toFixed(2)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-[#016B61]">Rs. {(priceToUse * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Totals */}
                <div className="bg-gray-50 p-6 rounded-2xl space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>Rs. {order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>Rs. {order.shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-black text-[#016B61] pt-2 border-t border-[#9ECFD4]/30">
                    <span>Total Amount</span>
                    <span>Rs. {order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-red-500 font-bold mb-4">Order details could not be found.</p>
                <Link href="/" className="text-[#016B61] underline font-bold">Return to home</Link>
              </div>
            )}

            {/* Support Footer */}
            <div className="mt-10 pt-8 border-t border-gray-100 text-center">
              <p className="text-[#016B61] font-medium mb-4">Need help? We&apos;re here for you.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/fetchProduct"
                  className="flex-1 bg-gradient-to-r from-[#9ECFD4] via-[#78B9B5] to-[#016B61] text-black py-4 rounded-xl font-bold text-center transition-all hover:scale-[1.02] shadow-lg"
                >
                  Continue Shopping
                </Link>
                <a
                  href="https://wa.me/923001234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 border-2 border-[#9ECFD4] text-[#016B61] py-4 rounded-xl font-bold text-center hover:bg-[#9ECFD4]/5 transition-all"
                >
                  WhatsApp Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#9ECFD4] via-[#78B9B5] to-[#016B61]/20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#78B9B5] border-t-transparent"></div>
        </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
