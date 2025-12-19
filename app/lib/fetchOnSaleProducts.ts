import { client } from '@/sanity/lib/client';
import { Product } from '../../types/product';

const query = `
  *[_type == "onsaleproducts" && defined(slug.current)] | order(_createdAt desc)[0..3] {
    _id,
    productName,
    price,
    currentPrice,
    discountPercentage,
    "slug": slug.current,
    image,
    description,
    category,
    inventory,
    status,
    colors
  }
`;

export async function fetchOnSaleProducts(): Promise<Product[]> {
  try {
    const products = await client.fetch(query);
    console.log('Fetched on sale products:', products); // Debug log
    return products;
  } catch (error) {
    console.error('Error fetching on sale products:', error);
    return [];
  }
}