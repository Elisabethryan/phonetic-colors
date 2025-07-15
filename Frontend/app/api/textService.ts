import { FormattedLetter } from "@/types/letter";

export async function fetchText(
  id: string
): Promise<{ text: FormattedLetter[] }> {
  const res = await fetch(`http://localhost:5000/text/${id}`);
  if (!res.ok) throw new Error(res.statusText);
  const data = await res.json();
  console.log(data);

  return data;
}
