import { useEffect, useState } from "react";

import type { List } from "./types/List";
import { getLists } from "./services/shoppingListService";

const App = () => {

  const [lists, setLists] = useState<List[]>([]);

  useEffect(() => {
    const effect = async () => {
      const listData = await getLists();
      setLists(listData);
    }
    effect();
  }, []);

  return (
    <>
      <h1>Kauppalistat</h1>
      <ul>
        {lists.map(list => (
          <li key={list.id}>{list.name} ({list.items.length} tuotetta)</li>
        ))}
      </ul>
    </>
  )
}

export default App
