'use client';

import React, { useTransition } from 'react';
import Image from 'next/image';
import { urlFor } from '../../../sanity/lib/image';
import { deleteProduct } from './actions';
import Link from 'next/link';

import { Product } from '@/types/product';

interface ProductsClientProps {
  products: Product[];
}

const ProductsClient: React.FC<ProductsClientProps> = ({ products }) => {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      startTransition(async () => {
        const result = await deleteProduct(productId);
        if (result.success) {
          // The page will be revalidated, so we don't need to manually refresh
        } else {
          alert(result.message);
        }
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
        <Link href="/admin_L5@X/products/new" passHref>
          <button className="relative bg-gradient-to-r from-[#9ECFD4] via-[#78B9B5] to-[#016B61] hover:from-[#78B9B5] hover:via-[#016B61] hover:to-[#9ECFD4] text-black py-2 px-4 rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-all duration-500">
            Add Product
          </button>
        </Link>
      </div>

      {/* Table View for Medium and Large Screens */}
      <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Image</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product Name</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Inventory</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {product.image && (
                      <Image
                        src={urlFor(product.image).width(50).height(50).url()}
                        alt={product.productName || 'Product image'}
                        width={50}
                        height={50}
                        className="rounded"
                      />
                    )}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{product.productName}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{product.category}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">Rs. {product.price?.toFixed(2)}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{product.inventory}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <Link href={`/admin_L5@X/products/edit/${product.slug}`} passHref>
                       <button className="px-3 py-1 bg-gradient-to-r from-[#9ECFD4] via-[#78B9B5] to-[#016B61] text-black text-xs font-bold rounded-md hover:from-[#78B9B5] hover:via-[#016B61] hover:to-[#9ECFD4] shadow-sm transition-all duration-300 mr-4">Edit</button>
                    </Link>
                    <button 
                      onClick={() => handleDelete(product._id)}
                      disabled={isPending}
                      className="px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-md hover:from-red-600 hover:to-red-700 shadow-sm transition-all duration-300 disabled:opacity-50"
                    >
                      {isPending ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Card View for Small Screens */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {products.map((product) => (
          <div key={product._id} className="bg-white shadow-md rounded-lg p-4">
            <div className="flex items-center mb-4">
              {product.image && (
                <Image
                  src={urlFor(product.image).width(60).height(60).url()}
                  alt={product.productName || 'Product image'}
                  width={60}
                  height={60}
                  className="rounded mr-4"
                />
              )}
              <h3 className="text-lg font-semibold text-gray-900">{product.productName}</h3>
            </div>
            <div className="space-y-2 text-sm text-gray-700">
              <p><span className="font-medium">Category:</span> {product.category}</p>
              <p><span className="font-medium">Price:</span> Rs. {product.price?.toFixed(2)}</p>
              <p><span className="font-medium">Inventory:</span> {product.inventory}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href={`/admin_L5@X/products/edit/${product.slug}`} passHref>
                 <button className="flex-1 px-3 py-1 bg-gradient-to-r from-[#9ECFD4] via-[#78B9B5] to-[#016B61] text-black text-xs font-bold rounded-md hover:from-[#78B9B5] hover:via-[#016B61] hover:to-[#9ECFD4] shadow-sm transition-all duration-300">Edit</button>
              </Link>
              <button 
                onClick={() => handleDelete(product._id)}
                disabled={isPending}
                className="flex-1 px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-md hover:from-red-600 hover:to-red-700 shadow-sm transition-all duration-300 disabled:opacity-50"
              >
                {isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsClient;
