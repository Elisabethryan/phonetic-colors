import styles from "../page.module.css";
import TextView from "../../components/text/TextView";

export default function Story() {
  return (
    <div className={`${styles.home} ${styles.storyPage}`}>
      <header className={`${styles.intro} ${styles.storyIntro}`}>
        <p className={styles.kicker}>Fonetisk läsning</p>
        <h1>Den lilla läsappen</h1>
      </header>
      <TextView />
    </div>
  );
}
