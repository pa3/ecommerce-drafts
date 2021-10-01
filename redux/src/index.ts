import { createStore } from "@/core/store";
import { startView } from "@/view";
import { startRouting } from "@/routing";
import { startNetwork } from "@/network";

const store = createStore();
startView(store);
startRouting(store);
startNetwork(store);
