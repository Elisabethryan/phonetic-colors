"use client";

import { useEffect, useState } from "react";
import styles from "./TextView.module.css";
import {
  createText,
  CreateFormattedLetter,
  fetchLatestText,
} from "@/app/api/textService";
import { FormattedLetter, StyleType } from "@/types/letter";
import Letter from "./Letter";

const DEFAULT_STYLE: StyleType = "unstyled";
const DEFAULT_COLOR = "#0f766e";

function toDraftLetters(
  value: string,
  previous: CreateFormattedLetter[],
): CreateFormattedLetter[] {
  const lettersOnly = value
    .split("")
    .filter((char) => /[A-Za-zÅÄÖåäö]/.test(char));

  return lettersOnly.map((char, index) => {
    const previousLetter = previous[index];
    return {
      letter: char as FormattedLetter["letter"],
      styleType: previousLetter?.styleType ?? DEFAULT_STYLE,
      color:
        (previousLetter?.styleType ?? DEFAULT_STYLE) === "colored"
          ? (previousLetter?.color ?? DEFAULT_COLOR)
          : null,
    };
  });
}

function TextView() {
  const [text, setText] = useState<FormattedLetter[] | undefined>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [rawText, setRawText] = useState("Hej");
  const [draftLetters, setDraftLetters] = useState<CreateFormattedLetter[]>(
    toDraftLetters("Hej", []),
  );

  useEffect(() => {
    loadLatestText();
  }, []);

  async function loadLatestText(): Promise<void> {
    try {
      setLoading(true);
      setError("");
      const story = await fetchLatestText();
      setText(story?.text);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load text";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function handleRawTextChange(value: string): void {
    setRawText(value);
    setDraftLetters((previous) => toDraftLetters(value, previous));
  }

  function updateDraftStyle(index: number, newStyleType: StyleType): void {
    setDraftLetters((previous) => {
      const next = [...previous];
      const current = next[index];
      if (!current) {
        return previous;
      }

      next[index] = {
        ...current,
        styleType: newStyleType,
        color:
          newStyleType === "colored" ? (current.color ?? DEFAULT_COLOR) : null,
      };

      return next;
    });
  }

  function updateDraftColor(index: number, newColor: string): void {
    setDraftLetters((previous) => {
      const next = [...previous];
      const current = next[index];
      if (!current) {
        return previous;
      }

      next[index] = {
        ...current,
        color: newColor,
      };

      return next;
    });
  }

  async function handleSaveText(): Promise<void> {
    if (draftLetters.length === 0) {
      setError("Please enter at least one letter.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const savedText = await createText(draftLetters);
      if (!savedText) {
        setError("Could not save text.");
        return;
      }

      setText(savedText.text);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not save text";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <p className={styles.helpText}>
        Enter plain text, then format each phonetic letter before saving.
      </p>

      <div className={styles.controls}>
        <input
          value={rawText}
          onChange={(event) => handleRawTextChange(event.target.value)}
          className={styles.textInput}
          maxLength={24}
          placeholder="Plain text (example: Hej)"
        />

        <button
          type="button"
          onClick={handleSaveText}
          className={styles.button}
        >
          Save Formatted Text
        </button>
      </div>

      <div className={styles.letterEditor}>
        {draftLetters.map((letter, index) => (
          <div
            key={`${letter.letter}-${index}`}
            className={styles.letterEditorItem}
          >
            <span className={styles.letterValue}>{letter.letter}</span>
            <select
              value={letter.styleType}
              onChange={(event) =>
                updateDraftStyle(index, event.target.value as StyleType)
              }
              className={styles.selectInput}
              aria-label={`Style for letter ${letter.letter}`}
            >
              <option value="unstyled">Unstyled</option>
              <option value="underlined">Underlined</option>
              <option value="colored">Colored</option>
            </select>
            <input
              type="color"
              value={letter.color ?? DEFAULT_COLOR}
              onChange={(event) => updateDraftColor(index, event.target.value)}
              disabled={letter.styleType !== "colored"}
              className={styles.colorInput}
            />
          </div>
        ))}
      </div>

      {loading ? <p>Loading...</p> : null}
      {error ? <p>{error}</p> : null}

      <div className={styles.textView}>
        {text?.map((letter, index) => (
          <Letter key={index} letter={letter}></Letter>
        ))}
      </div>
    </div>
  );
}

export default TextView;
