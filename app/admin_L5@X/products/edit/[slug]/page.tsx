import React from 'react';
import { client } from '../../../../../sanity/lib/client';
import EditProductForm from './EditProductForm'; 
import { Product } from '../../../../../types/product';
import { notFound } from 'next/navigation';

interface EditProductPageProps {
  // In some Next.js/Turbopack versions, params can be a promise
  params: Promise<{
    slug: string;
  }>;
}

// Re-evaluate this page every 0 seconds
export const revalidate = 0;

const EditProductPage = async ({ params }: EditProductPageProps) => {
  // Await the promise to get the actual params object
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  if (!slug) {
    return notFound();
  }

  const query = `*[_type == "product" && slug.current == $slug][0]`;
  const product: Product = await client.fetch(query, { slug });

  if (!product) {
    notFound();
  }

  return (
    <EditProductForm product={product} />
  );
};

export default EditProductPage;
