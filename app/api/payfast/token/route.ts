import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { basketId, amount, currencyCode = "PKR" } = await req.json();

  console.log("=== PayFast Token API ===");
  console.log("Input:", { basketId, amount, currencyCode });
  console.log("MERCHANT_ID:", process.env.PAYFAST_MERCHANT_ID);
  console.log("SECURED_KEY:", process.env.PAYFAST_SECURED_KEY);
  console.log("BASE_URL:", process.env.PAYFAST_BASE_URL);

  const params = new URLSearchParams({
    MERCHANT_ID: process.env.PAYFAST_MERCHANT_ID!,
    SECURED_KEY: process.env.PAYFAST_SECURED_KEY!,
    BASKET_ID: basketId,
    TXNAMT: String(amount),
    CURRENCY_CODE: currencyCode,
  });

  console.log("Params being sent:", params.toString());

  try {
    const res = await fetch(
      `${process.env.PAYFAST_BASE_URL}/GetAccessToken`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "NextJS PayFast Integration",
        },
        body: params.toString(),
      }
    );

    console.log("PayFast response status:", res.status);

    const text = await res.text();
    console.log("PayFast raw response:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("Failed to parse PayFast response as JSON");
      return NextResponse.json(
        { error: "Invalid response from PayFast", raw: text },
        { status: 500 }
      );
    }

    console.log("PayFast parsed response:", data);

    if (!data.ACCESS_TOKEN) {
      return NextResponse.json(
        { error: "Token fetch failed", details: data },
        { status: 400 }
      );
    }

    console.log("Token received successfully:", data.ACCESS_TOKEN);
    return NextResponse.json({ token: data.ACCESS_TOKEN });

  } catch (err) {
    console.error("PayFast network error:", err);
    return NextResponse.json(
      { error: "Network error", details: String(err) },
      { status: 500 }
    );
  }
}