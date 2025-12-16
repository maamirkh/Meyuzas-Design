// app/actions/actions.ts
"use server";

import { client } from "@/sanity/lib/client";

// Function to get the count of COD orders for the current day
export async function getCodOrderCountForToday() {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();

  try {
    const query = `count(*[_type == "order" && paymentMethod == "cod" && _createdAt >= $startOfDay && _createdAt < $endOfDay])`;
    const params = { startOfDay, endOfDay };
    const count = await client.fetch(query, params);
    return count;
  } catch (error) {
    console.error("Error fetching COD order count:", error);
    // In case of an error, we can return a high number to be safe and hide the option
    return 15; 
  }
}
