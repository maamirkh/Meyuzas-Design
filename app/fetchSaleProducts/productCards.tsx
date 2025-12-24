import Image from "next/image";
import { FiHeart, FiShoppingCart, FiStar } from "react-icons/fi";
import { Product } from "../../types/product";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";
import AddToCartButton from "../components/addToCart";

export default function ProductCards({ product }: { product: Product }) {
  const href = `/product/${product.slug.current}`;
  console.log("Generated href (sale):", href); // Debugging href
  return (
    <Link
      href={href}
      className="group relative block bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      {/* Badges */}
      {/* Discount Badge */}
      <div className="absolute top-3 left-3 z-10">
        {product.discountPercentage && (
          <span className="bg-red-500 text-white px-3 py-1 text-sm rounded-full">
            -{product.discountPercentage}%
          </span>
        )}
      </div>

      {/* Heart Button */}
      <div className="absolute top-3 right-3 z-10">
        <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-gray-100 transition-colors">
          <FiHeart className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Image */}
      <div className="relative aspect-square bg-gray-100">
        {product.image?.asset ? (
          <Image
            src={urlFor(product.image).url()}
            alt={product.productName || 'Product Image'}
            fill
            className="object-cover w-full h-full transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <FiShoppingCart className="w-12 h-12" />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-4">
        <div className="flex justify-between items-start h-14">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {product.productName}
          </h3>
          {product.rating && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <FiStar className="w-4 h-4 text-yellow-400" />
              {product.rating}
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="space-y-1 h-14">
            <span className="text-xl font-bold text-gray-900">Rs. {product.currentPrice}</span>
            {product.discountPercentage && ( // Only show original price if there's a discount
              <span className="block text-sm text-gray-500 line-through">
                Rs. {product.price}
              </span>
            )}
          </div>

          {/* Client-side AddToCart */}
          <AddToCartButton product={product} />
        </div>

        {product.inventory !== undefined && product.inventory <= 0 && (
          <div className="mt-3 text-sm text-red-600">Out of Stock</div>
        )}
      </div>
    </Link>
  );
}