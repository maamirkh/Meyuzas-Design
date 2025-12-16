'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { addProduct } from '../actions';

const AddProductPage = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const productName = formData.get('productName') as string;
    const category = formData.get('category') as string;
    const price = formData.get('price') as string;

    if (!productName || !category || !price || parseFloat(price) <= 0) {
        setError('Please fill in all required fields: Product Name, Category, and a valid Price.');
        return;
    }

    startTransition(async () => {
        const result = await addProduct(formData);
        if (result.success) {
            router.push('/admin_L5@X/products');
        } else {
            setError(result.message || 'An unknown error occurred.');
        }
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Add New Product</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="productName" className="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              name="productName"
              id="productName"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              name="category"
              id="category"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              id="price"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
              step="0.01"
            />
          </div>
          <div>
            <label htmlFor="inventory" className="block text-sm font-medium text-gray-700">Inventory (Stock)</label>
            <input
              type="number"
              name="inventory"
              id="inventory"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              id="description"
              rows={4}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>
          <div className="md:col-span-2">
            <div className="flex justify-between items-start">
              {/* Image Upload Section */}
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">Product Image</label>
                <input
                  type="file"
                  name="image"
                  id="image"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                {imagePreview && (
                  <div className="mt-4">
                    <img src={imagePreview} alt="Image preview" className="h-32 w-32 object-cover rounded-md" />
                  </div>
                )}
              </div>
              {/* Action Buttons Section */}
              <div className="flex items-center gap-4 pt-5">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isPending}
                    className="relative bg-gradient-to-r from-[#9ECFD4] via-[#78B9B5] to-[#016B61] hover:from-[#78B9B5] hover:via-[#016B61] hover:to-[#9ECFD4] text-black py-2 px-4 rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-all duration-500 disabled:opacity-50"
                >
                    {isPending ? 'Adding...' : 'Add Product'}
                </button>
              </div>
            </div>
          </div>
          {error && <p className="md:col-span-2 text-sm text-red-600">{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default AddProductPage;
