"use server"

import { revalidatePath } from "next/cache";
import { client } from "../../../sanity/lib/client";
import { SanityAssetDocument } from "next-sanity";

interface SanityProduct {
    _type: 'onsaleproducts' | 'product';
    productName: string;
    slug: {
        _type: 'slug';
        current: string;
    };
    category: string;
    price: number;
    inventory: number;
    description: string;
    discountPercentage?: number;
    currentPrice?: number;
    image?: {
        _type: 'image';
        asset: {
            _type: 'reference';
            _ref: string;
        };
    };
}

export async function deleteOnSaleProduct(productId: string) {
  try {
    await client.delete(productId);
    revalidatePath("/admin_L5@X/onsaleproducts");
    revalidatePath(`/admin_L5@X/onsaleproducts/edit/[slug]`, 'page');
    return { success: true };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return { success: false, message: "Failed to delete product." };
  }
}

export async function addOnSaleProduct(formData: FormData) {
    const productName = formData.get('productName') as string;
    const category = formData.get('category') as string;
    const price = parseFloat(formData.get('price') as string);
    const inventory = parseInt(formData.get('inventory') as string, 10);
    const description = formData.get('description') as string;
    const discountPercentage = parseFloat(formData.get('discountPercentage') as string);
    const currentPrice = parseFloat(formData.get('currentPrice') as string); // Get currentPrice from formData
    const imageFile = formData.get('image') as File;

    try {
        let imageAsset: SanityAssetDocument | undefined = undefined;
        if (imageFile && imageFile.size > 0) {
            const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
            imageAsset = await client.assets.upload('image', imageBuffer, {
                filename: imageFile.name,
            });
        }

        const newProduct: SanityProduct = {
            _type: 'onsaleproducts',
            productName,
            slug: {
                _type: 'slug',
                current: productName.toLowerCase().replace(/\s+/g, '-').slice(0, 200),
            },
            category,
            price,
            inventory,
            description,
            discountPercentage,
            currentPrice, // Add currentPrice
        };

        if (imageAsset) {
            newProduct.image = {
                _type: 'image',
                asset: {
                    _type: 'reference',
                    _ref: imageAsset._id,
                },
            };
        }

        await client.create(newProduct);

        revalidatePath("/admin_L5@X/onsaleproducts");
        return { success: true };
    } catch (error: unknown) {
        console.error("Failed to create product:", error);
        const message = error instanceof Error ? error.message : "An unknown error occurred";
        return { success: false, message: `Failed to create product: ${message}` };
    }
}

export async function updateOnSaleProduct(productId: string, formData: FormData) {
    const productName = formData.get('productName') as string;
    const category = formData.get('category') as string;
    const price = parseFloat(formData.get('price') as string);
    const inventory = parseInt(formData.get('inventory') as string, 10);
    const description = formData.get('description') as string;
    const discountPercentage = parseFloat(formData.get('discountPercentage') as string);
    const currentPrice = parseFloat(formData.get('currentPrice') as string); // Get currentPrice from formData
    const imageFile = formData.get('image') as File;

    try {
        let imageAsset: SanityAssetDocument | undefined = undefined;
        if (imageFile && imageFile.size > 0) {
             const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
            imageAsset = await client.assets.upload('image', imageBuffer, {
                filename: imageFile.name,
            });
        }
        
        const patch = client.patch(productId)
            .set({
                productName,
                category,
                price,
                inventory,
                description,
                discountPercentage,
                currentPrice, // Add currentPrice
                slug: {
                    _type: 'slug',
                    current: productName.toLowerCase().replace(/\s+/g, '-').slice(0, 200),
                },
            });

        if (imageAsset) {
            patch.set({
                image: {
                    _type: 'image',
                    asset: {
                        _type: 'reference',
                        _ref: imageAsset._id,
                    },
                },
            });
        }

        await patch.commit();

        revalidatePath("/admin_L5@X/onsaleproducts");
        revalidatePath(`/admin_L5@X/onsaleproducts/edit/${productName.toLowerCase().replace(/\s+/g, '-').slice(0, 200)}`);

        return { success: true };
    } catch (error: unknown) {
        console.error("Failed to update product:", error);
        const message = error instanceof Error ? error.message : "An unknown error occurred";
        return { success: false, message: `Failed to update product: ${message}` };
    }
}
