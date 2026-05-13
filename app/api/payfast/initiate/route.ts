import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { token, order } = body;
  // order mein basketId, amount, customer info hogi

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  // Yeh sab fields PayFast ko bhejni hain
  const formData = {
    MERCHANT_ID: process.env.PAYFAST_MERCHANT_ID!,
    MERCHANT_NAME: "Your Store Name",
    TOKEN: token,
    PROCCODE: "00",
    TXNAMT: String(order.amount),
    CUSTOMER_MOBILE_NO: order.phone,
    CUSTOMER_EMAIL_ADDRESS: order.email,
    SIGNATURE: crypto.randomUUID(),  // random string
    VERSION: "MERCHANT-CART-0001",
    TXNDESC: "Online Purchase",
    SUCCESS_URL: `${baseUrl}/payment/success`,
    FAILURE_URL: `${baseUrl}/payment/failed`,
    BASKET_ID: order.basketId,
    ORDER_DATE: new Date().toISOString().split("T")[0], // YYYY-MM-DD
    CHECKOUT_URL: `${baseUrl}/api/payfast/ipn`, // IPN endpoint
    CURRENCY_CODE: "PKR",
    TRAN_TYPE: "ECOMM_PURCHASE",
    CUSTOMER_NAME: order.customerName,
    MERCHANT_CUSTOMER_ID: order.customerId,
    CUSTOMER_IPADDRESS: req.headers.get("x-forwarded-for") || "127.0.0.1",
    COUNTRY: "Pakistan",
  };

  return NextResponse.json({ formData, gatewayUrl: `${process.env.PAYFAST_BASE_URL}/PostTransaction` });
}