// Remember this:

// “I need [api.ts] and [serverApi.ts] clients because my Next.js application runs code in two 
// different places: browser-side code already has access to the user's cookies, so it uses api.ts; 
// server-side code runs outside the browser, so it must explicitly read the user's cookie and 
// forward it to the backend, so it uses serverApi.ts.”

// Browser → api.ts → cookie is automatically available.
// Next.js Server → serverApi.ts → cookie must be explicitly forwarded.


import { cookies } from "next/headers";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3456/api";

export async function serverApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("access_token");

  if (!accessToken) {
    throw new Error("Authentication required");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,

    headers: {
      "Content-Type": "application/json",
      Cookie: `access_token=${accessToken.value}`,
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));

    throw new Error(
      error.message || `Request failed with status ${response.status}`
    );
  }

  return response.json();
}