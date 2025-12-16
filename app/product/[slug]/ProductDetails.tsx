"use client";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import { Product } from "../../../types/product";
import AddToCartButton from "../../components/addToCart";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  slug: string;
}

export default function ProductDetails({ slug }: Props) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = `*[_type in ["product", "onsaleproducts"] && slug.current == $slug][0]{
      _id,
      _type,
      productName,
      price,
      inventory,
      colors,
      status,
      description,
      "slug": slug.current,
      "image": image,
      discountPercentage,
      currentPrice
    }`;

    client.fetch(query, { slug }).then((data) => {
      if (data) {
        setProduct(data);
      } else {
        notFound();
      }
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return <div>Loading...</div>; // Or a proper loading skeleton
  }

  if (!product) {
    return notFound();
  }

  const displayPrice = product.currentPrice ?? product.price;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="mb-8 flex items-center gap-2 text-sm">
          <a
            href="/fetchProduct"
            className="text-slate-600 hover:text-blue-600 transition"
          >
            Products
          </a>
          <span className="text-slate-400">/</span>
          <span className="text-slate-900 font-medium">
            {product.productName}
          </span>
        </nav>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
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
                        <svg
                          className="w-10 h-10 text-slate-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <p className="text-slate-500 font-medium">
                        No image available
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-black text-slate-900 mb-2">
                  {product.productName}
                </h1>
                {product.status && (
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      product.status === "in-stock"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.status === "in-stock"
                      ? "✓ In Stock"
                      : "✗ Out of Stock"}
                  </span>
                )}
              </div>

              <div className="border-t border-b border-slate-200 py-6">
                <div className="flex items-baseline gap-3">
                  {product._type === "onsaleproducts" &&
                    product.price &&
                    product.currentPrice && (
                      <>
                        <span className="text-5xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          Rs. {product.currentPrice.toFixed(2)}
                        </span>
                        <span className="text-2xl font-bold text-slate-500 line-through">
                          Rs. {product.price.toFixed(2)}
                        </span>
                      </>
                    )}
                  {product._type !== "onsaleproducts" && (
                    <span className="text-5xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                              Rs. {displayPrice?.toFixed(2)}
                                            </span>                  )}
                  <span className="text-slate-500 text-lg">USD</span>
                </div>
              </div>

              {product.description && (
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900">
                    Description
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {product.colors && product.colors.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-slate-900">
                    Available Colors
                  </h3>
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

              {product.inventory !== undefined && (
                <div className="flex items-center gap-2 text-slate-600">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                  <span className="font-medium">
                    {product.inventory > 0
                      ? `${product.inventory} units available`
                      : "Out of stock"}
                  </span>
                </div>
              )}

              <div className="pt-6">
                <AddToCartButton product={product} />
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 space-y-3">
                <div className="flex items-center gap-3 text-slate-700">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm font-medium">
                    Free shipping on orders over Rs. 50
                  </span>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm font-medium">
                    30-day money back guarantee
                  </span>
                </div>
                <div className="flex items-center gap-3 text-slate-700">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm font-medium">
                    Secure payment processing
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
