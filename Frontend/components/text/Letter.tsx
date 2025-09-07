"use client";
import { FormattedLetter } from "@/types/letter";
import styles from "./TextView.module.css";

type LetterProps = {
  letter: FormattedLetter;
};

function Letter({ letter }: LetterProps) {
  return (
    <div>
      <span
        style={{
          color: letter.style.type === "colored" ? letter.style.color : "blue",
        }}
        className={styles.letter}
      >
        {letter.letter}
      </span>
    </div>
  );
}

export default Letter;
