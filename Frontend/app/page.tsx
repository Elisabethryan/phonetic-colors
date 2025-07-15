import styles from "./page.module.css";
import ListView from "../components/listView/ListView";

export default function Home() {
  return (
    <div className={styles.home}>
      <h1>Elisabeths lilla app</h1>
      <ListView />
    </div>
  );
}
