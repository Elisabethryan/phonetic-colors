import { FormattedLetter } from "@/types/letter";

export async function fetchText(
  id: string
): Promise<{ text: FormattedLetter[] } | undefined> {
  try {
    // Use your deployed backend URL
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await fetch(`${backendUrl}/text/${id}`);

    if (!res.ok) {
      console.error("Backend returned an error:", res.status, res.statusText);
      return undefined; // Return null instead of throwing
    }

    const data = await res.json();
    console.log("Fetched data:", data);

    return data;
  } catch (err) {
    console.error("Failed to fetch text:", err);
    return undefined; // Prevents crashing SSR
  }
}
