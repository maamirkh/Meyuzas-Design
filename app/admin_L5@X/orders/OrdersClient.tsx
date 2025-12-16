'use client';

import React, { useState, useMemo, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import { Order } from './page';
import { client } from '@/sanity/lib/client';
import { Dialog, Transition } from '@headlessui/react';

const getStatusClass = (status: string) => {
    switch (status) {
        case 'delivered':
        case 'Completed': // Legacy
            return 'bg-green-100 text-green-800';
        case 'pending':
            return 'bg-yellow-100 text-yellow-800';
        case 'shipped':
            return 'bg-blue-100 text-blue-800';
        case 'processing':
            return 'bg-purple-100 text-purple-800';
        case 'cancelled':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

const OrdersClient = ({ orders: initialOrders }: { orders: Order[] }) => {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [filter, setFilter] = useState('All');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const filteredOrders = useMemo(() => {
        return orders.filter(order => filter === 'All' || order.orderStatus === filter);
    }, [orders, filter]);

    const openViewModal = (order: Order) => {
        setSelectedOrder(order);
        setIsViewModalOpen(true);
    };

    const openEditModal = (order: Order) => {
        setSelectedOrder(order);
        setIsEditModalOpen(true);
    };

    const handleDelete = async (orderId: string) => {
        if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
            setIsDeleting(true);
            try {
                await client.delete(orderId);
                setOrders(prevOrders => prevOrders.filter(o => o._id !== orderId));
            } catch (error) {
                console.error('Failed to delete order:', error);
                alert('Failed to delete order. Please try again.');
            } finally {
                setIsDeleting(false);
            }
        }
    };
    
    const handleStatusChange = async (orderId: string, newStatus: Order['orderStatus']) => {
        try {
            await client.patch(orderId).set({ orderStatus: newStatus }).commit();
            setOrders(prevOrders => prevOrders.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('Failed to update status. Please try again.');
        }
    };

  return (
    <>
      <div className="mb-4 flex space-x-2">
        <button onClick={() => setFilter('All')} className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${filter === 'All' ? 'bg-gradient-to-r from-[#9ECFD4] via-[#78B9B5] to-[#016B61] text-black shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>All</button>
        <button onClick={() => setFilter('pending')} className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${filter === 'pending' ? 'bg-gradient-to-r from-[#9ECFD4] via-[#78B9B5] to-[#016B61] text-black shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Pending</button>
        <button onClick={() => setFilter('processing')} className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${filter === 'processing' ? 'bg-gradient-to-r from-[#9ECFD4] via-[#78B9B5] to-[#016B61] text-black shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Processing</button>
        <button onClick={() => setFilter('shipped')} className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${filter === 'shipped' ? 'bg-gradient-to-r from-[#9ECFD4] via-[#78B9B5] to-[#016B61] text-black shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Shipped</button>
        <button onClick={() => setFilter('delivered')} className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${filter === 'delivered' ? 'bg-gradient-to-r from-[#9ECFD4] via-[#78B9B5] to-[#016B61] text-black shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Delivered</button>
        <button onClick={() => setFilter('cancelled')} className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${filter === 'cancelled' ? 'bg-gradient-to-r from-[#9ECFD4] via-[#78B9B5] to-[#016B61] text-black shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Cancelled</button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap font-mono text-xs" title={order._id}>{order._id.slice(-8)}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{order.customerName}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{new Date(order._createdAt).toLocaleDateString()}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap font-semibold">Rs. {(order.totalAmount || 0).toFixed(2)}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <span className={`relative inline-block px-3 py-1 font-semibold leading-tight rounded-full text-xs ${getStatusClass(order.orderStatus || 'pending')}`}>
                    <span className="relative">{
                      (order.orderStatus || 'pending').charAt(0).toUpperCase() + (order.orderStatus || 'pending').slice(1)
                    }</span>
                  </span>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm flex items-center space-x-2">
                  <button onClick={() => openViewModal(order)} className="text-indigo-600 hover:text-indigo-900">View</button>
                  <button onClick={() => openEditModal(order)} className="text-green-600 hover:text-green-900">Edit</button>
                  <button onClick={() => handleDelete(order._id)} disabled={isDeleting} className="text-red-600 hover:text-red-900 disabled:opacity-50">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    {/* View Modal */}
    <Transition appear show={isViewModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsViewModalOpen(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex justify-center p-4 text-center" style={{ paddingTop: '88px' }}>
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-xl mx-auto transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">Order Details</Dialog.Title>
                  {selectedOrder && (
                     <div className="mt-4 space-y-4">
                        {/* Customer & Shipping */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-bold">Customer</h4>
                                <p>{selectedOrder.customerName}</p>
                                <p>{selectedOrder.email}</p>
                                <p>{selectedOrder.phone}</p>
                                <p className="text-sm text-gray-600 mt-2">Order Placed: {new Date(selectedOrder._createdAt).toLocaleString()}</p>
                            </div>
                            <div>
                                <h4 className="font-bold">Shipping Address</h4>
                                <p>{selectedOrder.address}</p>
                                <p>{selectedOrder.city}, {selectedOrder.province}, {selectedOrder.postalCode}</p>
                            </div>
                        </div>
                        {/* Items */}
                        <div>
                             <h4 className="font-bold mb-2">Order Items</h4>
                             <div className="space-y-2">
                                {selectedOrder.orderItems.map(item => (
                                    <div key={item._key} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            {item.product.image && (
                                              <Image src={urlFor(item.product.image).width(50).height(50).url()} alt={item.product.productName} width={50} height={50} className="rounded-md" />
                                            )}
                                            <div>
                                                <p className="font-semibold">{item.product.productName}</p>
                                                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-semibold">Rs. {((item.product?.price || 0) * (item.quantity || 0)).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                         {/* Pricing */}
                        <div className="text-right">
                            <p>Subtotal: Rs. {(selectedOrder.subtotal || 0).toFixed(2)}</p>
                            <p>Shipping: Rs. {(selectedOrder.shipping || 0).toFixed(2)}</p>
                            <p className="font-bold text-lg">Total: Rs. {(selectedOrder.totalAmount || 0).toFixed(2)}</p>
                        </div>
                     </div>
                  )}
                  <div className="mt-6">
                    <button type="button" className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none" onClick={() => setIsViewModalOpen(false)}>Close</button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>


    {/* Edit Modal */}
    <Transition appear show={isEditModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsEditModalOpen(false)}>
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="fixed inset-0 bg-black bg-opacity-25" /></Transition.Child>
            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                            <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">Update Order Status</Dialog.Title>
                            {selectedOrder && (
                                <div className="mt-4">
                                    <p className="mb-4">Order ID: <span className="font-mono text-sm bg-gray-100 p-1 rounded">{selectedOrder._id}</span></p>
                                    <select
                                        defaultValue={selectedOrder.orderStatus}
                                        onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value as Order['orderStatus'])}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                            )}
                             <div className="mt-6">
                                <button type="button" className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </div>
        </Dialog>
    </Transition>

    </>
  );
};

export default OrdersClient;