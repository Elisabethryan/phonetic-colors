import { FormattedLetter } from '@/types/letter';

export async function fetchLetters(): Promise<FormattedLetter[] | undefined> {
  try {
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const response = await fetch(`${backendUrl}/letter`, { cache: 'no-store' });

    if (!response.ok) {
      console.error('Backend returned an error:', response.status, response.statusText);
      return undefined;
    }

    return response.json();
  } catch (error) {
    console.error('Failed to fetch formatted letters', error);
    return undefined;
  }
}