import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client"; // aapka Sanity client

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    BASKET_ID,
    TXNRESPCODE,  // "00" = success
    TXNAMT,
    TRAN_AUTH_ID,
  } = body;

  if (TXNRESPCODE === "00") {
    // Order ko Sanity mein update karo
    await client
      .patch(BASKET_ID) // Sanity document ID = BASKET_ID
      .set({
        paymentStatus: "paid",
        transactionId: TRAN_AUTH_ID,
        paidAmount: Number(TXNAMT),
        paidAt: new Date().toISOString(),
      })
      .commit();
  } else {
    await client
      .patch(BASKET_ID)
      .set({ paymentStatus: "failed" })
      .commit();
  }

  return NextResponse.json({ status: "ok" });
}