import { useState } from "react";
import { fetchListItemInfo } from "../../api/listService";
import styles from "./ExtendedList.module.css";

function ExtendedListItem({
  item,
  selected,
  selectItem,
}: {
  item: string;
  selected: boolean;
  selectItem: (item: string) => void;
}) {
  const [description, setDescription] = useState<string>();

  const expandItem = async (item: string) => {
    selectItem(item);
    const extendedItem = await fetchListItemInfo(item);
    setDescription(extendedItem.desc);
  };

  return (
    <div
      onClick={() => expandItem(item)}
      key={item}
      className={`${styles.listItem} ${selected ? styles.boldText : ""}`}
    >
      {item}
      {selected && (
        <div>{description ? description : "loading description"}</div>
      )}
    </div>
  );
}

export default ExtendedListItem;
