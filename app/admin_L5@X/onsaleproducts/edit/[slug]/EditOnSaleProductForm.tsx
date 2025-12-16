'use client';

import React, { useState, useTransition, useEffect } from 'react'; // Import useEffect
import { useRouter } from 'next/navigation';
import { Product } from '../../../../../types/product';
import { updateOnSaleProduct } from '../../actions';
import { urlFor } from '../../../../../sanity/lib/image';

interface EditOnSaleProductFormProps {
    product: Product;
}

const EditOnSaleProductForm: React.FC<EditOnSaleProductFormProps> = ({ product }) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // State for inputs
    const [originalPrice, setOriginalPrice] = useState(product.price);
    const [currentDiscountPercentage, setCurrentDiscountPercentage] = useState(product.discountPercentage ?? 0);
    const [calculatedCurrentPrice, setCalculatedCurrentPrice] = useState(0); // State for calculated current price

    useEffect(() => {
        const priceNum = Number(originalPrice);
        const discountNum = Number(currentDiscountPercentage);
        if (!isNaN(priceNum) && !isNaN(discountNum) && discountNum >= 0 && discountNum <= 100) {
            const discounted = priceNum - (priceNum * discountNum / 100);
            setCalculatedCurrentPrice(discounted);
        } else {
            setCalculatedCurrentPrice(originalPrice); // Fallback to original price if inputs are invalid
        }
    }, [originalPrice, currentDiscountPercentage, product.price]); // Add product.price to dependencies

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
        // Price and discountPercentage are already handled by state
        const inventory = parseInt(formData.get('inventory') as string, 10);
        const description = formData.get('description') as string;
        
        // Use state values for validation
        if (!productName || !category || originalPrice <= 0 || currentDiscountPercentage < 0 || currentDiscountPercentage > 100) {
            setError('Please fill in all required fields: Product Name, Category, a valid Original Price and a valid Discount Percentage (0-100).');
            return;
        }

        // Add calculatedCurrentPrice to formData before sending
        formData.append('currentPrice', calculatedCurrentPrice.toFixed(2).toString()); // Ensure it's a string with 2 decimal places

        startTransition(async () => {
            const result = await updateOnSaleProduct(product._id, formData);
            if (result.success) {
                router.push('/admin_L5@X/onsaleproducts');
            } else {
                setError(result.message || 'An unknown error occurred.');
            }
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit On Sale Product</h1>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label htmlFor="productName" className="block text-sm font-medium text-gray-700">Product Name</label>
                        <input
                            type="text"
                            name="productName"
                            id="productName"
                            defaultValue={product.productName}
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
                            defaultValue={product.category}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Original Price</label> {/* Changed label */}
                        <input
                            type="number"
                            name="price"
                            id="price"
                            value={originalPrice} // Controlled component
                            onChange={(e) => setOriginalPrice(parseFloat(e.target.value) || 0)} // Update state, default to 0 if NaN
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
                            defaultValue={product.inventory}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="discountPercentage" className="block text-sm font-medium text-gray-700">Discount Percentage</label>
                        <input
                            type="number"
                            name="discountPercentage"
                            id="discountPercentage"
                            value={currentDiscountPercentage} // Controlled component
                            onChange={(e) => setCurrentDiscountPercentage(parseFloat(e.target.value) || 0)} // Update state, default to 0 if NaN
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                            step="0.01"
                        />
                    </div>
                    <div className="md:col-span-2">
                        {/* Display Calculated Current Price */}
                        <div className="mt-4 p-3 bg-gray-50 rounded-md shadow-sm border border-gray-200">
                            <h3 className="text-sm font-medium text-gray-700">Calculated Current Price:</h3>
                            <p className="text-lg font-bold text-indigo-600">Rs. {calculatedCurrentPrice.toFixed(2)}</p>
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            id="description"
                            defaultValue={product.description}
                            rows={4}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        ></textarea>
                    </div>

                    {/* Image Upload and Preview Section */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            {product.image ? (
                                <img src={urlFor(product.image).width(150).url()} alt="Current product" className="h-32 w-32 object-cover rounded-md" />
                            ) : (
                                <p className="text-sm text-gray-500">No image available</p>
                            )}
                            <div>
                                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mt-4 sm:mt-0">Upload New Image (optional)</label>
                                <input
                                    type="file"
                                    name="image"
                                    id="image"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                />
                                {imagePreview && (
                                    <div className="mt-2">
                                        <p className="text-sm font-medium text-gray-700">New Image Preview:</p>
                                        <img src={imagePreview} alt="New image preview" className="h-32 w-32 object-cover rounded-md mt-2" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && <p className="md:col-span-2 text-sm text-red-600">{error}</p>}

                    {/* Action Buttons */}
                    <div className="md:col-span-2 flex flex-col sm:flex-row justify-end gap-4 mt-6">
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
                            {isPending ? 'Updating...' : 'Update Product'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditOnSaleProductForm;
