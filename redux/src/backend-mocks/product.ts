import { rest } from "msw";
import { makeProduct } from "@/fixtures";
import { Product } from "@/core/product";
import { Constraints } from "@/core/product-list";

function getDelay() {
  return 0;
}

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
    const { page, perPage, sorting } = req.body as Constraints;

    const sortedProducts = Object.entries(sorting)
      .reverse()
      .reduce<Product[]>((prevSortResult, [by, order]) => {
        return [...prevSortResult].sort((productA, productB) => {
          const fieldA = productA[by];
          const fieldB = productB[by];
          let comparsion;
          if (typeof fieldA === "string") {
            comparsion = fieldA.localeCompare(fieldB);
          } else {
            comparsion = fieldA - fieldB;
          }
          return order === "asc" ? comparsion : -1 * comparsion;
        });
      }, allProducts);

    const foundProducts = sortedProducts.slice(perPage * (page - 1), perPage);

    return res(
      ctx.delay(getDelay()),
      ctx.json({
        items: foundProducts,
      })
    );
  }),
  rest.get("/api/products/:id", (req, res, ctx) => {
    const foundProduct = allProducts.find((product) => product.id === req.params.id);

    if (!foundProduct) {
      return res(ctx.delay(getDelay()), ctx.status(404));
    }

    return res(ctx.delay(getDelay()), ctx.json(foundProduct));
  }),
];
