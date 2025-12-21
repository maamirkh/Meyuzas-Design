import { client } from '@/sanity/lib/client';
import { Product } from '../../types/product';

const query = `
  *[_type == "onsaleproducts" && defined(slug.current)] | order(_createdAt desc)[0..3] {
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
    discountPercentage,
    currentPrice
  }
`;

export async function fetchSaleProducts(): Promise<Product[]> {
  try {
    const products = await client.fetch(query, {}, {
      next: { revalidate: 10 } // Revalidate every 10 seconds
    });
    console.log('Fetched sale products:', products); // Debug log
    return products;
  } catch (error) {
    console.error('Error fetching sale products:', error);
    return [];
  }
}