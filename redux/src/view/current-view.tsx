import { useSelector } from "react-redux";
import { NotFound } from "@/view/not-found";
import { RootState } from "@/core/store";

export const CurrentView = () => {
  const viewId = useSelector((state: RootState) => state.app.view.id);
  if (viewId === "product") return <h1>Product</h1>;
  if (viewId === "product-list") return <h1>Product list</h1>;
  return <NotFound />;
};
