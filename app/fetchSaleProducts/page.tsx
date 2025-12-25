import { client } from "@/sanity/lib/client";
import { Product } from "../../types/product"
import ProductCards from "./productCards";

export const revalidate = 0;
export default async function FetchSaleProductsPage() {
  const query = `
    *[_type == "onsaleproducts" && defined(slug.current)] 
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
      rating,
      discountPercentage,
      currentPrice
    }
  `;
  const products: Product[] = await client.fetch(query);

  return (
    <div className="bg-gray-100 dark:bg-gray-900 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCards key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}