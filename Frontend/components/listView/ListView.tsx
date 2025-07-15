"use client";

import { useEffect, useState } from "react";
import styles from "./ListView.module.css";
import List from "../List/List";
import { addItem, fetchListItemNames } from "../../app/api/listService";
import ExtendedList from "../ExtendedList/ExtendedList";

function ListView() {
  const [items, setItems] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    fetchListItemNames()
      .then((items) => setItems(items))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.listView}>
      {
        "TODO: läs in story/document istället, döp om så det heter något annat än story eller doucment (för document kan inte vara typnamnet). Nya api-endpointen finns på http://localhost:5000/text/12345"
      }
      {loading ?? "Loading..."}
      {error}
      {inputValue}
      <input
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
      />
      <button
        onClick={() => {
          addItem(inputValue);
        }}
      >
        Lägg till item
      </button>
      {/*<ExtendedList items={items}></ExtendedList>*/}
      <List items={items}></List>
    </div>
  );
}

export default ListView;
