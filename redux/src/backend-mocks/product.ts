import { rest } from "msw";
import { makeProduct } from "@/fixtures";
import { Product } from "@/core/products";
import { Constraints } from "@/core/product-list";
import { times } from "@/core/utils";

function getDelay() {
  return 0;
}

const allProducts = times(100, () => makeProduct());

export const productHandlers = [
  rest.post("/api/products", (req, res, ctx) => {
    const { page, perPage, sorting } = req.body as Constraints;

    // TODO: implement filtering here
    const foundProducts = allProducts;

    const sortedProducts = Object.entries(sorting)
      .reverse()
      .reduce<Product[]>((prevSortResult, [by, order]) => {
        return [...prevSortResult].sort((productA, productB) => {
          const fieldA = productA[by as keyof Product];
          const fieldB = productB[by as keyof Product];
          let comparsion;
          if (typeof fieldA === "string") {
            comparsion = fieldA.localeCompare(fieldB as string);
          } else {
            comparsion = fieldA === fieldB ? 0 : fieldA > fieldB ? -1 : 1;
          }
          return order === "asc" ? comparsion : -1 * comparsion;
        });
      }, foundProducts);

    const pagedProducts = sortedProducts.slice(perPage * (page - 1), perPage * page);

    return res(
      ctx.delay(getDelay()),
      ctx.json({
        total: sortedProducts.length,
        items: pagedProducts,
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
