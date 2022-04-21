import { startProductsSyncing } from "@/network/products";
import { startProductListSyncing } from "@/network/product-list";
import { Store } from "@/core/store";

export const startNetwork = (store: Store) => {
  startProductsSyncing(store);
  startProductListSyncing(store);
};
