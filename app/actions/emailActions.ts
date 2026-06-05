"use server";

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface InvoiceEmailProps {
  orderId: string;
  customerName: string;
  email: string;
  items: any[];
  totalAmount: number;
  subtotal: number;
  shipping: number;
  paymentMethod: string;
  address: string;
  city: string;
}

export async function sendInvoiceEmail({
  orderId,
  customerName,
  email,
  items,
  totalAmount,
  subtotal,
  shipping,
  paymentMethod,
  address,
  city,
}: InvoiceEmailProps) {
  if (!email) return { success: false, message: "No email provided" };

  try {
    const { data, error } = await resend.emails.send({
      from: "Meyuza's Designs <onboarding@resend.dev>", // Replace with your verified domain
      to: [email],
      subject: `Order Confirmation - ${orderId.slice(-8)}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h1 style="color: #016B61; text-align: center;">Meyuza's Designs</h1>
          <h2 style="text-align: center;">Order Invoice</h2>
          <p>Hi ${customerName},</p>
          <p>Thank you for your order! Your order has been successfully placed.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Order ID:</strong> ${orderId}</p>
            <p><strong>Payment Method:</strong> ${paymentMethod.toUpperCase()}</p>
            <p><strong>Shipping Address:</strong> ${address}, ${city}</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="border-bottom: 2px solid #eee;">
                <th style="text-align: left; padding: 10px;">Item</th>
                <th style="text-align: center; padding: 10px;">Qty</th>
                <th style="text-align: right; padding: 10px;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 10px;">${item.name}</td>
                  <td style="padding: 10px; text-align: center;">${item.quantity}</td>
                  <td style="padding: 10px; text-align: right;">Rs. ${((item.currentPrice || item.price) * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div style="text-align: right; line-height: 1.6;">
            <p>Subtotal: Rs. ${subtotal.toFixed(2)}</p>
            <p>Shipping: Rs. ${shipping.toFixed(2)}</p>
            <p style="font-size: 1.2em; font-weight: bold; color: #016B61;">Total: Rs. ${totalAmount.toFixed(2)}</p>
          </div>

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
          <p style="text-align: center; color: #777; font-size: 0.9em;">
            If you have any questions, please contact us on WhatsApp: +923001234567
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, error };
  }
}
