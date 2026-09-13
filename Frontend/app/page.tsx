import { fetchLetters } from '@/app/api/letterService';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const letters = await fetchLetters();

  return (
    <main className={styles.home}>
      <section className={styles.intro}>
        <p className={styles.kicker}>Läsa fonetiskt</p>
        <h1>Alfabetet</h1>
        <p>Färgkodade bokstäver från din databas.</p>
      </section>

      {letters ? (
        <ol className={styles.letterGrid} aria-label="Färgkodat alfabet">
          {letters.map((letter) => (
            <li key={letter.id}>
              <span
                className={styles.letter}
                style={{
                  color:
                    letter.styleType === 'colored'
                      ? (letter.color ?? undefined)
                      : undefined,
                  textDecoration:
                    letter.styleType === 'underlined' ? 'underline' : undefined,
                }}
              >
                {letter.letter}
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <p className={styles.unavailable}>
          Alfabetet kunde inte hämtas just nu.
        </p>
      )}
    </main>
  );
}
