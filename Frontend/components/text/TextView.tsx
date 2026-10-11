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

type SoundExample = {
  id: string;
  spellings: string[];
  word: string;
  icon: string;
};

const soundExamples: SoundExample[] = [
  {
    id: "sj",
    spellings: ["sj", "sh", "sch", "sk", "skj", "stj"],
    word: "sjö",
    icon: "🌊",
  },
  { id: "tj", spellings: ["kj", "tj", "ch"], word: "tjej", icon: "👧" },
  {
    id: "j",
    spellings: ["dj", "gj", "hj", "lj", "j"],
    word: "jordgubbe",
    icon: "🍓",
  },
  { id: "k", spellings: ["ck", "k", "kk", "q"], word: "katt", icon: "🐈" },
  { id: "s", spellings: ["s", "ss", "z", "c"], word: "sol", icon: "☀️" },
  { id: "a", spellings: ["a"], word: "apa", icon: "🐒" },
  { id: "å", spellings: ["å"], word: "åska", icon: "🌩️" },
  { id: "ä", spellings: ["ä"], word: "äpple", icon: "🍎" },
  { id: "b", spellings: ["b", "bb"], word: "boll", icon: "🏀" },
  { id: "d", spellings: ["d", "dd"], word: "drake", icon: "🪁" },
  { id: "e", spellings: ["e"], word: "ekorre", icon: "🐿️" },
  { id: "f", spellings: ["f", "ff"], word: "fisk", icon: "🐟" },
  { id: "g", spellings: ["g", "gg"], word: "glass", icon: "🍦" },
  { id: "h", spellings: ["h"], word: "hus", icon: "🏠" },
  { id: "i", spellings: ["i"], word: "is", icon: "🧊" },
  { id: "l", spellings: ["l", "ll"], word: "lampa", icon: "💡" },
  { id: "m", spellings: ["m", "mm"], word: "måne", icon: "🌙" },
  { id: "n", spellings: ["n", "ng", "nn"], word: "nyckel", icon: "🔑" },
  { id: "o", spellings: ["o"], word: "orm", icon: "🐍" },
  { id: "ö", spellings: ["ö"], word: "öga", icon: "👁️" },
  { id: "p", spellings: ["p", "pp"], word: "penna", icon: "✏️" },
  { id: "r", spellings: ["r", "rr"], word: "raket", icon: "🚀" },
  { id: "t", spellings: ["t", "tt"], word: "tåg", icon: "🚂" },
  { id: "u", spellings: ["u"], word: "uggla", icon: "🦉" },
  { id: "v", spellings: ["v", "w"], word: "val", icon: "🐋" },
  { id: "y", spellings: ["y"], word: "yxa", icon: "🪓" },
];

function getAvailableSoundOptions(letters: FormattedLetter[]) {
  const colors = new Map<string, { color: string; spellings: Set<string> }>();

  for (const letter of letters) {
    if (!isColorTarget(letter) || !letter.color?.trim()) continue;
    const colorKey = letter.color.trim().toLowerCase();
    const option = colors.get(colorKey) ?? {
      color: letter.color.trim(),
      spellings: new Set<string>(),
    };
    option.spellings.add(letter.letter.toLocaleLowerCase("sv-SE"));
    colors.set(colorKey, option);
  }

  const soundOptions = new Map<
    string,
    { example: SoundExample; colors: Set<string>; spellings: Set<string> }
  >();

  for (const colorOption of colors.values()) {
    const example = soundExamples.find((candidate) =>
      candidate.spellings.some((spelling) =>
        colorOption.spellings.has(spelling),
      ),
    );
    if (!example) continue;

    const soundOption = soundOptions.get(example.id) ?? {
      example,
      colors: new Set<string>(),
      spellings: new Set<string>(),
    };
    soundOption.colors.add(colorOption.color.toLowerCase());
    colorOption.spellings.forEach((spelling) =>
      soundOption.spellings.add(spelling),
    );
    soundOptions.set(example.id, soundOption);
  }

  return [...soundOptions.values()]
    .map(({ example, colors: soundColors, spellings }) => ({
      ...example,
      colors: [...soundColors],
      spellings: [...spellings].sort(),
    }))
    .sort((first, second) => first.word.localeCompare(second.word));
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
  const soundOptions = getAvailableSoundOptions([...alphabet, ...(text ?? [])]);
  const soundByColor = new Map(
    soundOptions.flatMap((option) =>
      option.colors.map((color) => [color, option.id] as const),
    ),
  );
  const hasColorTargets = (text ?? []).some(isColorTarget);
  const targetPositions = words.flatMap((word, wordIndex) =>
    word.flatMap((letter, letterIndex) =>
      isColorTarget(letter) ? [`${wordIndex}-${letterIndex}`] : [],
    ),
  );
  const sentenceIsComplete =
    targetPositions.length > 0 &&
    targetPositions.every((position) => Boolean(revealedColors[position]));

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
              <legend>Drag a word icon onto a faded letter</legend>
              <div className={styles.soundTiles}>
                {soundOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={styles.soundTile}
                    draggable
                    aria-label={`Drag ${option.word}, which starts with the ${[...option.spellings].join("/")} sound`}
                    title={`${option.word} (${option.spellings.join("/")})`}
                    onDragStart={(event) => {
                      event.dataTransfer.setData("text/plain", option.id);
                      event.dataTransfer.effectAllowed = "copy";
                    }}
                  >
                    <span className={styles.soundIcon} aria-hidden="true">
                      {option.icon}
                    </span>
                    <span className={styles.soundWord}>{option.word}</span>
                  </button>
                ))}
              </div>
            </fieldset>
          )}
          {sentenceIsComplete ? (
            <p className={styles.celebrationFeedback} role="status">
              <span className={styles.celebrationIcon} aria-hidden="true">
                🎉
              </span>
              <span>Sentence complete!</span>
            </p>
          ) : feedback ? (
            <p
              className={
                feedback.isError ? styles.errorFeedback : styles.successFeedback
              }
              role={feedback.isError ? "alert" : "status"}
            >
              {feedback.message}
            </p>
          ) : null}
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
                        isColorTarget={colorTarget && !revealedColors[position]}
                        onColorDrop={(soundId) => {
                          const color = letter.color;
                          if (!color) return;
                          const expectedSound = soundByColor.get(
                            color.trim().toLowerCase(),
                          );
                          if (soundId === expectedSound) {
                            setRevealedColors((revealed) => ({
                              ...revealed,
                              [position]: color,
                            }));
                            setFeedback({
                              message: "Correct sound.",
                              isError: false,
                            });
                          } else {
                            setFeedback({
                              message:
                                "That sound does not match. Try another.",
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
