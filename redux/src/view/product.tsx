import { useSelector } from "react-redux";
import { RootState } from "@/core/store";
import { routes } from "@/core/app";

export const Product = () => {
  const { productId } = useSelector((state: RootState) =>
    routes.product.getParams(state.app.url)
  );

  const product = useSelector((state: RootState) => state.products[productId]);

  return (
    <>
      <h2>Product</h2>
      {product.status === "loading" ? "Loading..." : <b>{product.data.name}</b>}
    </>
  );
};
