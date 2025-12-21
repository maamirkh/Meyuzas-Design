import { client } from "@/sanity/lib/client";
import { Product } from "../../types/product"
import ProductCards from "./productCards";

export const revalidate = 0; // Revalidate at most once per second, but allow manual revalidation
export default async function ProductsPage() {
  const query = `
    *[_type == "product" && defined(slug.current)]
    | order(_createdAt desc){
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
      rating
    }
  `;
  const products: Product[] = await client.fetch(query, {}, {
    next: { revalidate: 10 } // Revalidate every 10 seconds
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCards key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}