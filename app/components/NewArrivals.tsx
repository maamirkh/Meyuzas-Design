import { client } from '@/sanity/lib/client';
import { Product } from '../../types/product';
import { urlFor } from '@/sanity/lib/image';
import NewArrivalsClient from './NewArrivalsClient';

interface NewArrivalProduct {
  id: number;
  name: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice: number | null;
  image: string;
  slug: string;
}

async function getNewArrivalsData(): Promise<NewArrivalProduct[]> {
  const query = `
    *[_type == "product" && defined(slug.current)] {
      _id,
      _type,
      productName,
      description,
      price,
      inventory,
      colors,
      status,
      slug,
      "image": image,
      rating,
      discountPercentage
    } | order(_createdAt desc)[0..3]
  `;
  const sanityProducts: Product[] = await client.fetch(query, {}, {
    next: { revalidate: 10 } // Revalidate every 10 seconds
  }); // Using any since the query returns various fields

  // Map the Sanity product data to the expected format for the client component
  return sanityProducts.map((product: Product, index) => {
    let imageUrl = '/placeholder-product.jpg';
    try {
      if (product.image?.asset?._ref) {
        imageUrl = urlFor(product.image).url();
      }
    } catch (error) {
      console.error('Error generating image URL for product:', product._id, error);
    }

    return {
      id: index + 1,
      name: product.productName || 'Unknown Product',
      rating: product.rating || 0,
      reviews: 0, // Reviews are not available in the Sanity schema
      price: product.price || 0,
      originalPrice: product.discountPercentage
        ? Math.round(product.price * (1 + product.discountPercentage / 100))
        : null,
      image: imageUrl,
      slug: product.slug?.current || 'unknown'
    };
  });
}

export default async function NewArrivals() {
  const products = await getNewArrivalsData();

  return <NewArrivalsClient products={products} />;
}