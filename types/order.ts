// types/order.ts
import { Product } from './product';

export interface Order {
  _id: string;
  _createdAt: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  paymentMethod: 'cod' | 'payfast' | 'easypaisa' | 'jazzcash';
  paymentDetails?: {
    _type: 'object';
    accountNumber: string;
    transactionId: string;
  };
  subtotal: number;
  shipping: number;
  totalAmount: number;
  orderItems: {
    _key: string;
    quantity: number;
    price?: number;
    discountedPrice?: number;
    product: Product;
  }[];
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}
