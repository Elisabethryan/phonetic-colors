"use client";

import styles from "./List.module.css";

function ListItem({
  item,
  selected,
  selectItem,
}: {
  item: string;
  selected: boolean;
  selectItem: (item: string) => void;
}) {
  return (
    <div
      onClick={() => selectItem(item)}
      key={item}
      className={`${styles.listItem} ${selected ? styles.boldText : ""}`}
    >
      {item}
    </div>
  );
}

export default ListItem;
