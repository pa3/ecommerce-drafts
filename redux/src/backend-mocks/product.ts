import { rest } from "msw";
import { makeProduct } from "@/fixtures";

function times<T>(n: number, fn: (i: number) => T): T[] {
  const result: T[] = new Array(n);
  for (let i = 0; i < n; i++) {
    result[i] = fn(i);
  }
  return result;
}

const allProducts = times(100, () => makeProduct());

export const productHandlers = [
  rest.get("/api/products", (_, res, ctx) => {
    return res(
      ctx.delay(2000),
      ctx.json({
        items: allProducts,
      })
    );
  }),
  rest.get("/api/products/:id", (req, res, ctx) => {
    const foundProduct = allProducts.find(
      (product) => product.id === req.params.id
    );
    if (!foundProduct) {
      return res(ctx.delay(2000), ctx.status(404));
    }

    return res(ctx.delay(2000), ctx.json(foundProduct));
  }),
];
