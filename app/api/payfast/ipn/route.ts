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
    // Order ko Sanity mein update karo - Status 'pending' set karo
    await client
      .patch(BASKET_ID)
      .set({
        paymentStatus: "paid",
        orderStatus: "pending",
        transactionId: TRAN_AUTH_ID,
        paidAmount: Number(TXNAMT),
        paidAt: new Date().toISOString(),
      })
      .commit();
  } else {
    // Agar payment fail hui to inventory wapas karo aur order delete kardo
    try {
      // 1. Order details fetch karo inventory revert karne ke liye
      const order = await client.fetch(`*[_id == $id][0] {
        orderItems[] {
          quantity,
          "productId": product._ref
        }
      }`, { id: BASKET_ID });

      if (order && order.orderItems) {
        const transaction = client.transaction();
        
        // 2. Inventory wapas (increment) karo
        order.orderItems.forEach((item: any) => {
          if (item.productId && item.quantity) {
            transaction.patch(item.productId, {
              inc: { inventory: item.quantity }
            });
          }
        });

        // 3. Order document delete kardo
        transaction.delete(BASKET_ID);
        
        await transaction.commit();
      }
    } catch (error) {
      console.error("Error reverting failed online order:", error);
    }
  }

  return NextResponse.json({ status: "ok" });
}