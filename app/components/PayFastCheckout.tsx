"use client";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";

interface Props {
  orderId: string;
  amount: number;
  items: { name: string; price: number; qty: number; sku: string }[];
}

export default function PayFastCheckout({ orderId, amount, items }: Props) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Step 1: Token lo
      const tokenRes = await fetch("/api/payfast/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          basketId: orderId,
          amount,
          currencyCode: "PKR",
        }),
      });
      const { token } = await tokenRes.json();

      // Step 2: Form data lo
      const initiateRes = await fetch("/api/payfast/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          order: {
            basketId: orderId,
            amount,
            email: user?.emailAddresses[0]?.emailAddress,
            phone: user?.phoneNumbers[0]?.phoneNumber || "03001234567",
            customerName: user?.fullName,
            customerId: user?.id,
          },
        }),
      });
      const { formData, gatewayUrl } = await initiateRes.json();

      // Step 3: Hidden form banao aur submit karo (PayFast redirection ke liye)
      const form = document.createElement("form");
      form.method = "POST";
      form.action = gatewayUrl;

      Object.entries(formData).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error("Payment error:", err);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition disabled:opacity-60"
    >
      {loading ? "Processing..." : `Pay PKR ${amount}`}
    </button>
  );
}