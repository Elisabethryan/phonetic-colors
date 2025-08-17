import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.home}>
      <h1>Elisabeths lilla app</h1>
      <p>Detta är startsida, gå till /story för att komma vidare</p>
    </div>
  );
}
