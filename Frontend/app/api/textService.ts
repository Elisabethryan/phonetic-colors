import { FormattedLetter } from "@/types/letter";

export async function fetchText(
  id: string
): Promise<{ id: string; text: FormattedLetter[] }> {
  const backendUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const res = await fetch(`${backendUrl}/text/${id}`);

  if (!res.ok) {
    throw new Error(`Could not load text (${res.status})`);
  }

  return res.json();
}
