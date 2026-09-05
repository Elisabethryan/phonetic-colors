"use client";

import { useEffect, useState } from "react";
import styles from "./TextView.module.css";
import { fetchText } from "@/app/api/textService";
import { FormattedLetter } from "@/types/letter";
import Letter from "./Letter";

function TextView() {
  const [text, setText] = useState<FormattedLetter[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [textId, setTextId] = useState("12345");

  useEffect(() => {
    setLoading(true);
    setError("");
    fetchText(textId)
      .then((story) => setText(story.text))
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Could not load text")
      )
      .finally(() => setLoading(false));
  }, [textId]);

  if (loading) {
    return <p>Loading text…</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  if (text.length === 0) {
    return <p>This text has no letters.</p>;
  }

  return (
    <div className={styles.textView}>
      {text.map((letter, index) => (
        <Letter key={`${letter.id}-${index}`} letter={letter} />
      ))}
    </div>
  );
}

export default TextView;
