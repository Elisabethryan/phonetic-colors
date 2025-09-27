export async function fetchDbHealth(): Promise<
  { message: string; statusCode: string } | undefined
> {
  try {
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    return (await fetch(`${backendUrl}/testdb`)).json();
  } catch (err) {
    console.error("Failed to get and json:ify database health", err);
    return undefined;
  }
}
