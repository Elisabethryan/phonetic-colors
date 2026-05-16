import { FormattedLetter } from "@/types/letter";

type StoryText = {
  id: string;
  text: FormattedLetter[];
};

export type CreateFormattedLetter = Omit<FormattedLetter, "id">;

function getBackendUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
}

async function parseOptionalJson<T>(res: Response): Promise<T | undefined> {
  const raw = await res.text();
  if (!raw.trim()) {
    return undefined;
  }

  try {
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error("Failed to parse backend JSON response", err);
    return undefined;
  }
}

export async function fetchText(
  id: string
): Promise<StoryText | undefined> {
  try {
    const res = await fetch(`${getBackendUrl()}/text/${id}`);

    if (!res.ok) {
      console.error("Backend returned an error:", res.status, res.statusText);
      return undefined;
    }

    const data = await parseOptionalJson<StoryText>(res);
    return data;
  } catch (err) {
    console.error("Failed to fetch text", err);
    return undefined;
  }
}

export async function fetchLatestText(): Promise<StoryText | undefined> {
  try {
    const res = await fetch(`${getBackendUrl()}/text/latest`);

    if (!res.ok) {
      console.error("Backend returned an error:", res.status, res.statusText);
      return undefined;
    }

    const data = await parseOptionalJson<StoryText>(res);
    return data;
  } catch (err) {
    console.error("Failed to fetch latest text", err);
    return undefined;
  }
}

export async function createText(
  formattedLetters: CreateFormattedLetter[]
): Promise<StoryText | undefined> {
  try {
    const res = await fetch(`${getBackendUrl()}/text`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ formattedLetters }),
    });

    if (!res.ok) {
      console.error("Backend returned an error:", res.status, res.statusText);
      return undefined;
    }

    const data = await parseOptionalJson<StoryText>(res);
    return data;
  } catch (err) {
    console.error("Failed to create text", err);
    return undefined;
  }
}
