"use server";

import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const password = formData.get("password");

  // Get the password from environment variables
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (password === adminPassword) {
    // IMPORTANT: This localStorage method is insecure for production.
    // A secure, HTTP-only cookie-based session is recommended.
    // For this refactor, we are keeping the existing logic but on the server.
    return { success: true };
  } else {
    return { success: false, error: "Invalid password" };
  }
}
