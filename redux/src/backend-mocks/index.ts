import { setupWorker } from "msw";
import { productHandlers } from "@/backend-mocks/product";

export const startBackendMocks = () => {
  const worker = setupWorker(...productHandlers);
  worker.start();
};
