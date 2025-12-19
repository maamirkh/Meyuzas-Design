import { urlFor } from '@/sanity/lib/image';
import { fetchSaleProducts } from '@/app/lib/fetchSaleProducts';
import TopSellingClient from './TopSellingClient';

interface Product {
  id: number;
  name: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice: number | null;
  image: string;
  slug: string;
}

async function getTopSellingProductsData(): Promise<Product[]> {
  const sanityProducts = await fetchSaleProducts();

  // Map the Sanity product data to the expected format for the client component
  return sanityProducts.map((product, index) => {
    let imageUrl = '/placeholder-product.jpg';
    try {
      if (product.image?.asset?._ref) {
        imageUrl = urlFor(product.image).url();
      }
    } catch (error) {
      console.error('Error generating image URL for sale product:', product._id, error);
    }

    return {
      id: index + 1,
      name: product.productName || 'Unknown Product',
      rating: product.rating || 0,
      reviews: 0, // Reviews are not available in the Sanity schema
      price: product.currentPrice || product.price || 0,
      originalPrice: product.price && product.discountPercentage
        ? Math.round(product.price)
        : null,
      image: imageUrl,
      slug: product.slug?.current || 'unknown'
    };
  });
}

export default async function TopSelling() {
  const products = await getTopSellingProductsData();

  return <TopSellingClient products={products} />;
}