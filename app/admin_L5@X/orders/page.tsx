import { client } from '@/sanity/lib/client';
import { Order } from '@/types/order';
import OrdersClient from './OrdersClient';

// We can re-export the type for the client component to use, making it co-located.
export type { Order };

async function getOrders(): Promise<Order[]> {
  // Updated query to fetch all product fields
  const query = `*[_type == "order"] | order(_createdAt desc) {
    _id,
    _createdAt,
    customerName,
    totalAmount,
    orderStatus,
    orderItems[] {
      _key,
      quantity,
      product-> {
        _id,
        productName,
        price,
        inventory,
        colors,
        status,
        description,
        slug,
        image,
        rating,
        discount
      }
    },
    phone,
    email,
    address,
    city,
    province,
    postalCode,
    paymentMethod,
    paymentDetails,
    subtotal,
    shipping
  }`;

  const orders: Order[] = await client.fetch(query);
  return orders;
}

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>
      </div>
      <OrdersClient orders={orders} />
    </div>
  );
}