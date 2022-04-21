import { useSelector, useDispatch } from "react-redux";
import { selectProduct } from "@/core/products";
import { RootState } from "@/core/store";

const ProductListRow = (props: { productId: string }) => {
  const product = useSelector((state: RootState) =>
    selectProduct(state, props.productId)
  );

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
      <td>{remoteState.name}</td>
      <td>{remoteState.price}</td>
    </tr>
  );
};

export const ProductList = () => {
  const productList = useSelector((state: RootState) => state.productList);

  return (
    <>
      <h2>Product list!</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
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
