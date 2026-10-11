"use client";
import { useState } from "react";
import type { DragEvent } from "react";
import { FormattedLetter } from "@/types/letter";
import styles from "./TextView.module.css";

type LetterProps = {
  letter: FormattedLetter;
  displayColor?: string;
  isColorTarget?: boolean;
  onColorDrop?: (color: string) => void;
};

function Letter({
  letter,
  displayColor,
  isColorTarget = false,
  onColorDrop,
}: LetterProps) {
  const [dragOver, setDragOver] = useState(false);

  function handleDragOver(event: DragEvent<HTMLSpanElement>) {
    if (!isColorTarget) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    setDragOver(true);
  }

  function handleDrop(event: DragEvent<HTMLSpanElement>) {
    if (!isColorTarget) return;
    event.preventDefault();
    setDragOver(false);
    const color = event.dataTransfer.getData("text/plain");
    if (color) onColorDrop?.(color);
  }

  return (
    <span
      style={{
        color:
          isColorTarget && !displayColor
            ? "#b8b8b8"
            : (displayColor ??
              (letter.styleType === "colored"
                ? (letter.color ?? "#555555")
                : "#555555")),
        textDecoration:
          letter.styleType === "underlined" ? "underline" : "none",
      }}
      className={`${styles.letter} ${isColorTarget ? styles.colorTarget : ""} ${dragOver ? styles.dragOver : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      {letter.letter}
    </span>
  );
}

export default Letter;
