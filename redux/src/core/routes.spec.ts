import { makeRoute } from "./routes";

const encodeRouteB = (params: { paramB: number; x?: boolean }) => ({
  paramB: params.paramB.toString(),
  x: params.x ? "true" : "false",
});

const decodeRouteB = (params: { paramB: string; x?: string }) => ({
  paramB: Number(params.paramB),
  x: params.x === "true",
});

const routeA =
  makeRoute<{ paramA?: string; x?: string; y?: string }>("/route-a/:paramA?");
const routeB = makeRoute<{ paramB: number; x?: boolean }>(
  "/route-b/:paramB",
  encodeRouteB,
  decodeRouteB
);

describe("makeRoute", () => {
  describe("provides isMatching, which", () => {
    const isMatching = routeA.isMatching;

    it("checks if url matches the route", () => {
      expect(isMatching("/route-a")).toBe(true);
      expect(isMatching("/route-a/foo?page=1")).toBe(true);
      expect(isMatching("/view")).toBe(false);
      expect(isMatching("/other-route")).toBe(false);
    });
  });

  describe("provides getUrl, which", () => {
    const getUrl = routeA.getUrl;

    it("builds an url for given params", () => {
      const url = getUrl({ paramA: "foo" });
      expect(url).toBe("/route-a/foo");
    });

    it("adds non-path params as query part of the url", () => {
      const url = getUrl({
        paramA: "foo",
        x: "plain-text",
        y: "needs encoding",
      });
      expect(url).toBe("/route-a/foo?x=plain-text&y=needs%20encoding");
    });
  });

  describe("provides getParams, which", () => {
    const getParams = routeA.getParams;

    it("extracts path params", () => {
      expect(getParams("/route-a/foo")).toEqual({ paramA: "foo" });
    });

    it("extracts query params alongside with path params", () => {
      expect(getParams("/route-a/foo?x=1&y=needs%20decoding")).toEqual({
        paramA: "foo",
        x: "1",
        y: "needs decoding",
      });
    });

    it("throws if url is not matching the route", () => {
      expect(() => getParams("/non-matching-route")).toThrow();
    });

    it("decodes parameters", () => {
      expect(routeB.getParams("/route-b/1?x=true")).toStrictEqual({
        paramB: 1,
        x: true,
      });
    });
  });
});
