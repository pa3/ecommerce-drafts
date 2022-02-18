import { render } from "react-dom";
import { Provider } from "react-redux";
import { Store } from "redux";
import { AppLayout } from "@/view/app-layout";
import "@/view/global.css";

export const startView = (store: Store) => {
  const rootElement = document.getElementById("root");

  render(
    <Provider store={store}>
      <AppLayout />
    </Provider>,
    rootElement
  );
};
