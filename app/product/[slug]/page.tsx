// import { client } from "@/sanity/lib/client";
// import { urlFor } from "@/sanity/lib/image";
// import Image from "next/image";
// import React from "react";
// import { addToCart } from "../../../actions/actions";
// import Swal from "sweetalert2";
// import { Product } from "../../../types/product";
// import AddToCartButton from "../../components/addToCart";

// interface Props {
//   params: {
//     slug: string;
//   };
// }

// export default async function Productpage({ params }: Props) {
//   const { slug } = params;

//   // Fetch product data from Sanity
//   const data = await client.fetch(`
//     *[_type == "product" && slug.current == "${slug}"]{
//       _id,
//       productName,
//       price,
//       inventory,
//       colors,
//       status,
//       description,
//       "slug": slug.current,
//       "image": image
//     }
//   `);

//   const product = data[0];

//   // Debugging: Check if product data is fetched correctly
//   console.log("Product Data:", product);

//   const handleAddToCart =(e: React.MouseEvent, product: Product) => {
//       e.preventDefault()
//       Swal.fire({
//         position: "top-right",
//         icon: "success",
//         title: `${product.productName} added to cart`,
//         showConfirmButton: false,
//         timer: 1000
  
//       })
//       addToCart(product)
//     }

//   // Handle missing product
//   if (!product) {
//     return (
//       <div className="max-w-4xl mx-auto p-4">
//         <h1 className="text-2xl font-bold text-red-600">Product not found</h1>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto p-4 md:p-8">
//       {/* Main Content */}
//       <div className="flex flex-col md:flex-row gap-8">
//         {/* Main Image */}
//         <div className="w-full md:w-1/2 lg:w-2/5">
//           {product.image?.asset ? (
//             <div className="relative aspect-square w-full rounded-lg overflow-hidden shadow-lg">
//               <Image
//                 src={urlFor(product.image).url()}
//                 alt={product.name}
//                 fill
//                 className="object-cover"
//                 priority
//               />
//             </div>
//           ) : (
//             <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
//               <p className="text-gray-500">No image available</p>
//             </div>
//           )}
//         </div>

//         {/* Product Details */}
//         <div className="w-full md:w-1/2 lg:w-3/5">
//           <h1 className="text-3xl font-bold text-gray-900 mb-4">
//             {product.name}
//           </h1>
//           <p className="text-2xl text-gray-800 font-semibold mb-4">
//             ${product.price}
//           </p>
          
//           <p className="text-md text-gray-600 mb-6">
//             <span className="font-medium">Description:</span>{" "}
//             {product.description}
//           </p>

//           {/* Add to Cart Button */}
//           <AddToCartButton product={product} />
//         </div>
//       </div>
//     </div>
//   );
// }


import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import { Product } from "../../../types/product";
import AddToCartButton from "../../components/addToCart";
import { notFound } from "next/navigation";

// ✅ Next.js 16: params is a Promise
interface Props {
  params: Promise<{
    slug: string;
  }>;
}

// ✅ Generate static params for better performance (optional but recommended)
export async function generateStaticParams() {
  const slugs = await client.fetch(`
    *[_type == "product"] {
      "slug": slug.current
    }
  `);
  
  return slugs.map((item: { slug: string }) => ({
    slug: item.slug,
  }));
}

export default async function ProductPage({ params }: Props) {
  // ✅ Next.js 16: Must await params
  const { slug } = await params;

  // ✅ Parameterized query for security
  const query = `
    *[_type == "product" && slug.current == $slug][0]{
      _id,
      productName,
      price,
      inventory,
      colors,
      status,
      description,
      "slug": slug.current,
      "image": image
    }
  `;

  // Fetch product with parameterized query
  const product: Product | null = await client.fetch(query, { slug });

  // Handle 404
  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm">
          <a href="/fetchProduct" className="text-slate-600 hover:text-blue-600 transition">
            Products
          </a>
          <span className="text-slate-400">/</span>
          <span className="text-slate-900 font-medium">{product.productName}</span>
        </nav>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Image Section */}
            <div className="space-y-4">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-xl bg-slate-100">
                {product.image?.asset ? (
                  <Image
                    src={urlFor(product.image).url()}
                    alt={product.productName}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    priority
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-4 bg-slate-200 rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-slate-500 font-medium">No image available</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Title */}
              <div>
                <h1 className="text-4xl font-black text-slate-900 mb-2">
                  {product.productName}
                </h1>
                {product.status && (
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    product.status === 'in-stock' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.status === 'in-stock' ? '✓ In Stock' : '✗ Out of Stock'}
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="border-t border-b border-slate-200 py-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ${product.price}
                  </span>
                  <span className="text-slate-500 text-lg">USD</span>
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900">Description</h3>
                  <p className="text-slate-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900">Available Colors</h3>
                  <div className="flex gap-2 flex-wrap">
                    {product.colors.map((color, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700 transition-colors cursor-pointer"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Inventory */}
              {product.inventory !== undefined && (
                <div className="flex items-center gap-2 text-slate-600">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <span className="font-medium">
                    {product.inventory > 0 
                      ? `${product.inventory} units available` 
                      : 'Out of stock'}
                  </span>
                </div>
              )}

              {/* Add to Cart Button */}
              <div className="pt-6">
                <AddToCartButton product={product} />
              </div>

              {/* Additional Info */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 space-y-3">
                <div className="flex items-center gap-3 text-slate-700">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium">Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium">30-day money back guarantee</span>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium">Secure payment processing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}