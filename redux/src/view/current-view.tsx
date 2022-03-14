import { useSelector } from "react-redux";
import { NotFound } from "@/view/not-found";
import { ProductPage } from "@/view/product-page";
import { ProductList } from "@/view/product-list";
import { RootState } from "@/core/store";

export const CurrentView = () => {
  const { routeId } = useSelector((state: RootState) => state.app);
  if (routeId === "product") return <ProductPage />;
  if (routeId === "productList") return <ProductList />;
  return <NotFound />;
};
