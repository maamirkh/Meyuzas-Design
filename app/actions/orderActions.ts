"use server";

import { revalidatePath } from "next/cache";
import { client } from "../../sanity/lib/client";
import { sendInvoiceEmail } from "./emailActions";

interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    _type: 'product' | 'onsaleproducts';
    discountPercentage?: number;
    currentPrice?: number;
}

export interface OrderDocument {
    _type: 'order';
    customerName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
    paymentMethod: string;
    subtotal: number;
    shipping: number;
    totalAmount: number;
    orderStatus: string;
    orderItems: Array<{
        _key: string;
        product: {
            _type: 'reference';
            _ref: string;
        };
        quantity: number;
        price: number;
        discountedPrice?: number;
    }>;
    paymentDetails?: {
        _type: 'object';
        accountNumber: string;
        transactionId: string;
    };
}

export async function createOrder(orderData: OrderDocument, cartItems: OrderItem[]) {
    try {
        // 1. First check if inventory is available for all items
        for (const item of cartItems) {
            const product = await client.fetch(`*[_id == $id][0]{inventory, productName}`, { id: item.id });
            if (!product) {
                return { success: false, message: `Product ${item.name} not found.` };
            }
            if ((product.inventory || 0) < item.quantity) {
                return { success: false, message: `Insufficient inventory for ${product.productName}. Only ${product.inventory} left.` };
            }
        }

        // 2. Create the order
        const result = await client.create(orderData);

        // 3. Create a transaction to decrement inventory
        const transaction = client.transaction();
        cartItems.forEach(item => {
            transaction.patch(item.id, {
                dec: { inventory: item.quantity }
            });
        });
        await transaction.commit();

        // 4. Send Invoice Email (only for COD or if already paid, but online is handled in IPN)
        if (orderData.paymentMethod === 'cod') {
            await sendInvoiceEmail({
                orderId: result._id,
                customerName: orderData.customerName,
                email: orderData.email,
                items: cartItems,
                totalAmount: orderData.totalAmount,
                subtotal: orderData.subtotal,
                shipping: orderData.shipping,
                paymentMethod: orderData.paymentMethod,
                address: orderData.address,
                city: orderData.city,
            });
        }

        revalidatePath("/admin_L5@X/orders"); // Revalidate admin orders page
        return { success: true, message: "Order placed successfully.", orderId: result._id };
    } catch (error: unknown) {
        console.error("Failed to place order:", error);
        const message = error instanceof Error ? error.message : "An unknown error occurred";
        return { success: false, message: `Failed to place order: ${message}` };
    }
}

export async function deleteOrder(orderId: string) {
    try {
        await client.delete(orderId);
        revalidatePath("/admin_L5@X/orders");
        return { success: true, message: "Order deleted successfully." };
    } catch (error: unknown) {
        console.error("Failed to delete order:", error);
        const message = error instanceof Error ? error.message : "An unknown error occurred";
        return { success: false, message: `Failed to delete order: ${message}` };
    }
}

export async function updateOrderStatus(orderId: string, newStatus: string) {
    try {
        await client.patch(orderId).set({ orderStatus: newStatus }).commit();
        revalidatePath("/admin_L5@X/orders");
        return { success: true, message: "Order status updated successfully." };
    } catch (error: unknown) {
        console.error("Failed to update order status:", error);
        const message = error instanceof Error ? error.message : "An unknown error occurred";
        return { success: false, message: `Failed to update order status: ${message}` };
    }
}