import styles from "../page.module.css";
import TextView from "../../components/text/TextView";

export default function Story() {
  return (
    <div className={styles.home}>
      <h1>Läsa fonetiskt</h1>
      <TextView />
    </div>
  );
}
