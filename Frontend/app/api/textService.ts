import { FormattedLetter } from "@/types/letter";

export async function fetchText(
  id: string
): Promise<{ text: FormattedLetter[] } | undefined> {
  try {
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await fetch(`${backendUrl}/text/${id}`);

    if (!res.ok) {
      console.error("Backend returned an error:", res.status, res.statusText);
      return undefined;
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to fetch letter and convert it to json", err);
    return undefined;
  }
}
