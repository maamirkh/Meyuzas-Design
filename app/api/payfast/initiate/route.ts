import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { token, order } = body;

  // ✅ HTTPS force kiya - http wali problem fix
  const rawBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  const baseUrl = rawBaseUrl.startsWith("https://")
    ? rawBaseUrl
    : rawBaseUrl.replace("http://", "https://");

  const formData = {
    MERCHANT_ID: process.env.PAYFAST_MERCHANT_ID!,
    MERCHANT_NAME: "Your Store Name",
    TOKEN: token,
    PROCCODE: "00",
    TXNAMT: String(order.amount),
    CUSTOMER_MOBILE_NO: order.phone,
    CUSTOMER_EMAIL_ADDRESS: order.email,
    SIGNATURE: crypto.randomUUID(),
    VERSION: "MERCHANT-CART-0001",
    TXNDESC: "Online Purchase",
    SUCCESS_URL: `${baseUrl}/payment/success`,
    FAILURE_URL: `${baseUrl}/payment/failed`,
    BASKET_ID: order.basketId,
    ORDER_DATE: new Date().toISOString().split("T")[0],
    CHECKOUT_URL: `${baseUrl}/api/payfast/ipn`,
    CURRENCY_CODE: "PKR",
    TRAN_TYPE: "ECOMM_PURCHASE",
    CUSTOMER_NAME: order.customerName,
    MERCHANT_CUSTOMER_ID: order.customerId,
    CUSTOMER_IPADDRESS: req.headers.get("x-forwarded-for") || "127.0.0.1",
    COUNTRY: "Pakistan",
  };

  // ✅ PayFast gateway URL bhi hardcoded https
  const gatewayUrl = process.env.PAYFAST_GATEWAY_URL || "https://ipguat.apps.net.pk/Ecommerce/api/Transaction/PostTransaction";

  return NextResponse.json({ formData, gatewayUrl });
}