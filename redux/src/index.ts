import { createStore } from "@/core/store";
import { startView } from "@/view";
import { startRouting } from "@/routing";
import { startNetwork } from "@/network";
import { startBackendMocks } from "@/backend-mocks";

startBackendMocks();

const store = createStore();
startView(store);
startRouting(store);
startNetwork(store);
