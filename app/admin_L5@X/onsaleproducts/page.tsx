import React from 'react';
import { client } from '../../../sanity/lib/client';
import OnSaleProductsClient from './OnSaleProductsClient';
import { Product } from '../../../types/product';

// Re-evaluate this page every 0 seconds
export const revalidate = 0;

const OnSaleProductsPage = async () => {
  const query = `*[_type == "onsaleproducts"]{
    _id,
    productName,
    "slug": slug.current,
    category,
    price,
    inventory,
    image,
    discountPercentage
  }`;
  
  const products: Product[] = await client.fetch(query);

  return (
    <OnSaleProductsClient products={products} />
  );
};

export default OnSaleProductsPage;