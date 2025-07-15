import { useState } from "react";
import styles from "./ExtendedList.module.css";
import ExtendedListItem from "./ExtendedListItem";

function ExtendedList({ items }: { items: string[] }) {
  const [selectedItem, setSelectedItem] = useState<string>();

  const setSelected = async (item: string) => {
    setSelectedItem(item);
  };

  return (
    <div className={styles.listContainer}>
      {items.map((item) => (
        <ExtendedListItem
          key={item}
          item={item}
          selected={selectedItem === item}
          selectItem={setSelected}
        ></ExtendedListItem>
      ))}
    </div>
  );
}

export default ExtendedList;
