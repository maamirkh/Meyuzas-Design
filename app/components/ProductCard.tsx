import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: string;
    originalPrice?: string;
    image: string;
    isSale?: boolean;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const numericPrice = parseFloat(product.price.replace("Rs. ", ""));
  const numericOriginalPrice = product.originalPrice ? parseFloat(product.originalPrice.replace("Rs. ", "")) : 0;

  const discountPercentage = 
    (numericOriginalPrice > numericPrice) 
      ? Math.round(((numericOriginalPrice - numericPrice) / numericOriginalPrice) * 100) 
      : 0;

  return (
    <div className="group relative bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Discount Badge */}
      {(product.isSale || discountPercentage > 0) && (
        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
          {discountPercentage > 0 ? `${discountPercentage}% OFF` : 'SALE'}
        </div>
      )}
      
      {/* Product Image */}
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative w-full h-64 overflow-hidden">
          <Image 
            src={product.image} 
            alt={product.name} 
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            quality={75}
          />
        </div>
      </Link>
      
      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate mb-2">{product.name}</h3>
        
        {/* Pricing */}
        <div className="flex items-baseline gap-2 mb-3">
          <p className="text-xl font-bold text-red-600">Rs. {product.price}</p>
          {product.originalPrice && (
            <p className="text-sm text-gray-500 line-through">Rs. {product.originalPrice}</p>
          )}
        </div>
        
        {/* Add to Cart Button */}
        <button 
          className="w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-900 transition-colors duration-300 font-medium"
          aria-label={`Add ${product.name} to cart`}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;