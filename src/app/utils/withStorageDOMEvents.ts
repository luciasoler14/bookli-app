import { StoreApi } from "zustand";
import { Mutate } from "zustand";

type StoreWithPersist<T> = Mutate<StoreApi<T>, [["zustand/persist", unknown]]>;

export function withStorageDOMEvents<T>(store: StoreWithPersist<T>) {
  const storageEventCallback = (e: StorageEvent) => {
    if (e.key === store.persist.getOptions().name && e.newValue) {
      store.persist.rehydrate();
    }
  };

  window.addEventListener("storage", storageEventCallback);

  return () => {
    window.removeEventListener("storage", storageEventCallback);
  };
}
