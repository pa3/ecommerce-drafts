import { rest } from "msw";

export const productHandlers = [
  rest.get("/api/products", (_, res, ctx) => {
    return res(
      ctx.json({
        items: [
          {
            id: "1",
            name: "Product 1",
          },
          {
            id: "2",
            name: "Product 2",
          },
          {
            id: "3",
            name: "Product 3",
          },
        ],
      })
    );
  }),
  rest.get("/api/products/:id", (req, res, ctx) => {
    return res(
      ctx.json({
        id: req.params.id,
        name: `Product ${req.params.id}`,
      })
    );
  }),
];
