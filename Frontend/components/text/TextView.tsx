"use client";

import { Fragment, useEffect, useState } from "react";
import styles from "./TextView.module.css";
import { fetchText, fetchTexts, TextListItem } from "@/app/api/textService";
import { fetchLetters } from "@/app/api/letterService";
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

function getAvailableColors(letters: FormattedLetter[]) {
  const colors = new Map<string, string>();

  for (const letter of letters) {
    if (!isColorTarget(letter) || !letter.color?.trim()) continue;
    const key = letter.color.trim().toLowerCase();
    if (!colors.has(key)) colors.set(key, letter.color.trim());
  }

  return [...colors.values()].sort((first, second) =>
    first.localeCompare(second),
  );
}

function isColorTarget(letter: FormattedLetter) {
  const color = letter.color?.trim().toLowerCase();
  return (
    letter.styleType === "colored" && Boolean(color) && color !== "#555555"
  );
}

function TextView() {
  const [text, setText] = useState<FormattedLetter[] | undefined>();
  const [alphabet, setAlphabet] = useState<FormattedLetter[]>([]);
  const [revealedColors, setRevealedColors] = useState<Record<string, string>>(
    {},
  );
  const [feedback, setFeedback] = useState<{
    message: string;
    isError: boolean;
  } | null>(null);
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
    let cancelled = false;

    fetchLetters().then((letters) => {
      if (!cancelled && letters) setAlphabet(letters);
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
  const colors = getAvailableColors([...(text ?? []), ...alphabet]);
  const hasColorTargets = (text ?? []).some(isColorTarget);

  return (
    <div className={styles.textPanel}>
      {sampleTexts.length > 0 && (
        <label className={styles.textSelector}>
          <span>Example text</span>
          <select
            value={textId}
            onChange={(event) => {
              setTextId(event.target.value);
              setRevealedColors({});
              setFeedback(null);
            }}
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
        <>
          {hasColorTargets && (
            <fieldset className={styles.colorPalette}>
              <legend>Drag a color onto a faded letter</legend>
              <div className={styles.colorSwatches}>
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={styles.colorSwatch}
                    style={{ backgroundColor: color }}
                    draggable
                    aria-label={`Drag color ${color}`}
                    title={color}
                    onDragStart={(event) => {
                      event.dataTransfer.setData("text/plain", color);
                      event.dataTransfer.effectAllowed = "copy";
                    }}
                  />
                ))}
              </div>
            </fieldset>
          )}
          {feedback && (
            <p
              className={
                feedback.isError ? styles.errorFeedback : styles.successFeedback
              }
              role={feedback.isError ? "alert" : "status"}
            >
              {feedback.message}
            </p>
          )}
          <div className={styles.textView}>
            {words.map((word, wordIndex) => (
              <Fragment key={wordIndex}>
                {wordIndex > 0 && " "}
                <span className={styles.word}>
                  {word.map((letter, letterIndex) => {
                    const position = `${wordIndex}-${letterIndex}`;
                    const colorTarget = isColorTarget(letter);

                    return (
                      <Letter
                        key={letterIndex}
                        letter={letter}
                        displayColor={revealedColors[position]}
                        isColorTarget={colorTarget}
                        onColorDrop={(color) => {
                          if (!letter.color) return;
                          if (
                            color.toLowerCase() === letter.color.toLowerCase()
                          ) {
                            setRevealedColors((revealed) => ({
                              ...revealed,
                              [position]: letter.color as string,
                            }));
                            setFeedback({
                              message: "Correct color.",
                              isError: false,
                            });
                          } else {
                            setFeedback({
                              message:
                                "That color does not match. Try another.",
                              isError: true,
                            });
                          }
                        }}
                      />
                    );
                  })}
                </span>
              </Fragment>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default TextView;
