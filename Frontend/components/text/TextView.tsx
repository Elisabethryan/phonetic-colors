"use client";

import { useEffect, useState } from "react";
import styles from "./Text.module.css";
import { fetchText } from "@/app/api/textService";
import { FormattedLetter } from "@/types/letter";

function TextView() {
  const [text, setText] = useState<FormattedLetter[] | undefined>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchText("12345")
      .then((story) => setText(story ? story.text : undefined))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {loading ?? "Loading..."}
      {error}
      {text?.map((letter, index) => (
        <span style={{}} key={index}>
          {"TODO I STYLE TAGGEN SKA STYLE_OBJEKTET IN PÅ NÅGOT SÄTT"}
          {letter.letter}
        </span>
      ))}
    </div>
  );
}

export default TextView;
