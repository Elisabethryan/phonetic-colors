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
          color:
            letter.styleType === "colored" ? letter.color ?? undefined : undefined,
          textDecoration:
            letter.styleType === "underlined" ? "underline" : "none",
        }}
        className={styles.letter}
      >
        {letter.letter}
      </span>
    </div>
  );
}

export default Letter;
