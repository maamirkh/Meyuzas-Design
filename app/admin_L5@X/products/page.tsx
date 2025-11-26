import React from 'react';

const products = [
  {
    id: 1,
    name: 'Classic White T-Shirt',
    category: 'Apparel',
    price: '$29.99',
    stock: 120,
  },
  {
    id: 2,
    name: 'Black Denim Jeans',
    category: 'Apparel',
    price: '$89.99',
    stock: 75,
  },
  {
    id: 3,
    name: 'Leather Crossbody Bag',
    category: 'Accessories',
    price: '$129.99',
    stock: 30,
  },
  {
    id: 4,
    name: 'Minimalist Silver Watch',
    category: 'Accessories',
    price: '$199.99',
    stock: 15,
  },
];

const ProductsPage = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
        <button className="relative bg-gradient-to-r from-[#9ECFD4] via-[#78B9B5] to-[#016B61] hover:from-[#78B9B5] hover:via-[#016B61] hover:to-[#9ECFD4] text-black py-2 px-4 rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-all duration-500 flex items-center justify-center group">
          Add Product
        </button>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Product Name
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Category
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Price
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{product.name}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{product.category}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{product.price}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{product.stock}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <button className="px-3 py-1 bg-gradient-to-r from-[#9ECFD4] via-[#78B9B5] to-[#016B61] text-black text-xs font-bold rounded-md hover:from-[#78B9B5] hover:via-[#016B61] hover:to-[#9ECFD4] shadow-sm transition-all duration-300 mr-4">Edit</button>
                  <button className="px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-md hover:from-red-600 hover:to-red-700 shadow-sm transition-all duration-300">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsPage;