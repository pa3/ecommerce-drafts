import { rest } from "msw";
import { makeProduct } from "@/fixtures";
import { Constraints } from "@/core/product-list";

function times<T>(n: number, fn: (i: number) => T): T[] {
  const result: T[] = new Array(n);
  for (let i = 0; i < n; i++) {
    result[i] = fn(i);
  }
  return result;
}

const allProducts = times(100, () => makeProduct());

export const productHandlers = [
  rest.post("/api/products", (req, res, ctx) => {
    const { page, perPage } = req.body as Constraints;
    const foundProducts = allProducts.splice(perPage * (page - 1), perPage);

    return res(
      ctx.delay(1000),
      ctx.json({
        items: foundProducts,
      })
    );
  }),
  rest.get("/api/products/:id", (req, res, ctx) => {
    const foundProduct = allProducts.find(
      (product) => product.id === req.params.id
    );

    if (!foundProduct) {
      return res(ctx.delay(1000), ctx.status(404));
    }

    return res(ctx.delay(1000), ctx.json(foundProduct));
  }),
];
