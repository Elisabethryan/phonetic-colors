"use client";

import { useState } from "react";
import styles from "./List.module.css";
import ListItem from "./ListItem";

function List({ items }: { items: string[] }) {
  const [selectedItem, setSelectedItem] = useState<string>();

  const setSelected = (item: string) => {
    setSelectedItem(item);
  };

  return (
    <div className={styles.listContainer}>
      {items.map((item) => (
        <ListItem
          key={item}
          item={item}
          selected={selectedItem === item}
          selectItem={setSelected}
        ></ListItem>
      ))}
    </div>
  );
}

export default List;
