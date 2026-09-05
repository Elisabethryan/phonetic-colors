"use client";

import { useEffect, useState } from "react";
import styles from "./TextView.module.css";
import { fetchText } from "@/app/api/textService";
import { FormattedLetter } from "@/types/letter";
import Letter from "./Letter";

function TextView() {
  const [text, setText] = useState<FormattedLetter[] | undefined>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [textId, setTextId] = useState("12345");

  useEffect(() => {
    fetchText(textId)
      .then((story) => setText(story ? story.text : undefined))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {loading ?? "Loading..."}
      {error}
      <div className={styles.textView}>
        {text?.map((letter, index) => (
          <Letter key={index} letter={letter}></Letter>
        ))}
      </div>
    </div>
  );
}

export default TextView;
