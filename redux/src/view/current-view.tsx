import { useSelector } from "react-redux";
import { NotFound } from "@/view/not-found";
import { Product } from "@/view/product";
import { ProductList } from "@/view/product-list";
import { RootState } from "@/core/store";

export const CurrentView = () => {
  const viewId = useSelector((state: RootState) => state.app.view.id);
  if (viewId === "product") return <Product />;
  if (viewId === "product-list") return <ProductList />;
  return <NotFound />;
};
