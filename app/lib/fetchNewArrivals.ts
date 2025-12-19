import { client } from '@/sanity/lib/client';
import { Product } from '../../types/product';

const query = `
  *[_type == "product" && defined(slug.current)] | order(_createdAt desc)[0..3] {
    _id,
    productName,
    price,
    "slug": slug.current,
    image,
    description,
    category,
    inventory,
    status,
    colors,
    rating,
    discountPercentage
  }
`;

export async function fetchNewArrivals(): Promise<Product[]> {
  try {
    const products = await client.fetch(query);
    console.log('Fetched products:', products); // Debug log
    return products;
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    return [];
  }
}