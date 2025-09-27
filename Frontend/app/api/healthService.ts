export async function fetchDbHealth(): Promise<
  { message: string; statusCode: number } | undefined
> {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const url = backendUrl + "/testdb";

  return fetchHealth(url);
}

export async function fetchBeHealth(): Promise<{
  message: string;
  statusCode: number;
}> {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const url = backendUrl + "/health";

  return fetchHealth(url);
}

async function fetchHealth(url: string): Promise<{
  message: string;
  statusCode: number;
}> {
  try {
    const res = await fetch(url);
    let message: string;

    try {
      // Try to parse JSON if possible
      const jsonResponse = await res.json();
      message = jsonResponse.message ?? "";
    } catch {
      // Fallback to text if not JSON
      message = await res.text();
    }

    return {
      message,
      statusCode: res.status,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return {
      message,
      statusCode: 0, // 0 = network or fetch failure (no HTTP status)
    };
  }
}
