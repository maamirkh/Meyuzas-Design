import React from 'react';
import { client } from '../../../../../sanity/lib/client';
import EditOnSaleProductForm from './EditOnSaleProductForm'; 
import { Product } from '../../../../../types/product';
import { notFound } from 'next/navigation';

interface EditOnSaleProductPageProps {
  // In some Next.js/Turbopack versions, params can be a promise
  params: Promise<{
    slug: string;
  }>;
}

// Re-evaluate this page every 0 seconds
export const revalidate = 0;

const EditOnSaleProductPage = async ({ params }: EditOnSaleProductPageProps) => {
  // Await the promise to get the actual params object
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  if (!slug) {
    return notFound();
  }

  const query = `*[_type == "onsaleproducts" && slug.current == $slug][0]`;
  const product: Product = await client.fetch(query, { slug });

  if (!product) {
    notFound();
  }

  return (
    <EditOnSaleProductForm product={product} />
  );
};

export default EditOnSaleProductPage;
