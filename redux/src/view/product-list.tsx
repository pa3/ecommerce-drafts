import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectProduct } from "@/core/products";
import { sortBy } from "@/core/product-list";
import { RootState } from "@/core/store";
import { Link } from "@/view/link";
import { routes } from "@/core/app";

const ProductListRow = (props: { productId: string }) => {
  const { productId } = props;
  const product = useSelector((state: RootState) => selectProduct(state, productId));

  const { remoteState } = product;
  if (!remoteState) {
    return (
      <tr>
        <td>--</td>
        <td>--</td>
      </tr>
    );
  }

  return (
    <tr>
      <td>
        <Link url={routes.product.getUrl({ productId })}>{remoteState.name}</Link>
      </td>
      <td>{remoteState.price}</td>
    </tr>
  );
};

const ProductListHeaderCell = (props: { label: string; field: string }) => {
  const { sorting } = useSelector((state: RootState) => state.productList.constraints);
  const dispatch = useDispatch();
  const toggleSort = useCallback(() => dispatch(sortBy(props.field)), [props.field]);

  return (
    <th>
      <button onClick={toggleSort}>
        {props.label}
        {sorting[props.field] ? (sorting[props.field] === "asc" ? "↓" : "↑") : ""}
      </button>
    </th>
  );
};

export const ProductList = () => {
  const productList = useSelector((state: RootState) => state.productList);

  return (
    <>
      <h2>Products</h2>
      <table>
        <thead>
          <tr>
            <ProductListHeaderCell label="Name" field="name" />
            <ProductListHeaderCell label="Price" field="price" />
          </tr>
        </thead>
        <tbody>
          {productList.itemIds.map((productId) => (
            <ProductListRow key={productId} productId={productId} />
          ))}
        </tbody>
      </table>
    </>
  );
};
