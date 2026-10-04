"use client";

import { Fragment, useEffect, useState } from "react";
import styles from "./TextView.module.css";
import { fetchText, fetchTexts, TextListItem } from "@/app/api/textService";
import { FormattedLetter } from "@/types/letter";
import Letter from "./Letter";

function groupLettersByWord(letters: FormattedLetter[]) {
  const words: FormattedLetter[][] = [];
  let currentWord: FormattedLetter[] = [];

  for (const letter of letters) {
    if (letter.letter.trim() === "") {
      if (currentWord.length > 0) words.push(currentWord);
      currentWord = [];
    } else {
      currentWord.push(letter);
    }
  }

  if (currentWord.length > 0) words.push(currentWord);
  return words;
}

function TextView() {
  const [text, setText] = useState<FormattedLetter[] | undefined>();
  const [sampleTexts, setSampleTexts] = useState<TextListItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [textId, setTextId] = useState("");

  useEffect(() => {
    let cancelled = false;

    fetchTexts().then((items) => {
      if (cancelled) return;

      setSampleTexts(items);
      if (items.length > 0) {
        setTextId(String(items[0].id));
      } else {
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!textId) return;

    let cancelled = false;
    setLoading(true);
    setError("");

    fetchText(textId)
      .then((story) => {
        if (cancelled) return;
        if (!story) {
          setText(undefined);
          setError("Could not load the selected text.");
          return;
        }
        setText(story.text);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load text.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [textId]);

  const words = groupLettersByWord(text ?? []);

  return (
    <div className={styles.textPanel}>
      {sampleTexts.length > 0 && (
        <label className={styles.textSelector}>
          <span>Example text</span>
          <select
            value={textId}
            onChange={(event) => setTextId(event.target.value)}
          >
            {sampleTexts.map((sample) => (
              <option key={sample.id} value={sample.id}>
                {sample.title}
              </option>
            ))}
          </select>
        </label>
      )}
      {loading && <p>Loading...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && !text && <p>No example texts available.</p>}
      {text && !loading && !error && (
        <div className={styles.textView}>
          {words.map((word, wordIndex) => (
            <Fragment key={wordIndex}>
              {wordIndex > 0 && " "}
              <span className={styles.word}>
                {word.map((letter, letterIndex) => (
                  <Letter key={letterIndex} letter={letter} />
                ))}
              </span>
            </Fragment>
          ))}
        </div>
      )}
    </div>
  );
}

export default TextView;
