import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/core/store";
import { Product, changeProduct } from "@/core/products";
import { RemoteEntity } from "@/core/remote-entity";
import { routes } from "@/core/app";

const;

const ProductForm = (props: {
  productId: string;
  product: RemoteEntity<Product>;
}) => {
  const { product, productId } = props;
  const dispatch = useDispatch();
  if (product.status !== "ready") return null;

  return (
    <input
      type="text"
      value={product.localChanges?.name ?? product.remoteState.name}
      onChange={(event) =>
        dispatch(
          changeProduct({
            id: productId,
            field: "name",
            value: event.target.value,
          })
        )
      }
    />
  );
};

export const ProductPage = () => {
  const { productId } = useSelector((state: RootState) =>
    routes.product.getParams(state.app.url)
  );

  const product = useSelector((state: RootState) => state.products[productId]);

  return (
    <>
      <h2>Product</h2>
      {product.status === "loading" && "Loading..."}
      {product.status === "loading-error" && "Error"}
      <ProductForm productId={productId} product={product} />
    </>
  );
};
