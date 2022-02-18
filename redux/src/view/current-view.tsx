import { useSelector } from "react-redux";
import { NotFound } from "@/view/not-found";
import { Product } from "@/view/product";
import { ProductList } from "@/view/product-list";
import { RootState } from "@/core/store";

export const CurrentView = () => {
  const { routeId } = useSelector((state: RootState) => state.app);
  if (routeId === "product") return <Product />;
  if (routeId === "productList") return <ProductList />;
  return <NotFound />;
};
