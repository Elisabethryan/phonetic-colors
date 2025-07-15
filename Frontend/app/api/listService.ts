import { ExtendedListItem } from "../../types/listItemTypes";

// itemService.ts
export async function fetchListItemNames(): Promise<string[]> {
  const res = await fetch("http://localhost:5000/list-items");
  if (!res.ok) throw new Error(res.statusText);
  const data = (await res.json()) as ExtendedListItem[];
  return data.map((extendedItem) => {
    return extendedItem.name;
  });
}

export async function addItem(name: string) {
  const body = {
    name: name,
  };
  const res = await fetch("http://localhost:5000/add-item", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(res.statusText);
  const data = await res.json();
  console.log(data);
}

export async function fetchListItemInfo(
  name: string
): Promise<{ id: string; name: string; desc: string }> {
  const res = await fetch(`http://localhost:5000/list-item-info/${name}`);
  if (!res.ok) throw new Error(res.statusText);
  const data = await res.json();
  return data;
}
