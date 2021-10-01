import { makeRoute } from "./routes";

describe("makeRoute", () => {
  const route = makeRoute<{ bar: string; x?: string; y?: string }, "foo">(
    "foo",
    "/foo/:bar?"
  );

  describe.only("provides isMatching, which", () => {
    const isMatching = route.isMatching;

    it("checks if url matches the route", () => {
      expect(isMatching("/foo")).toBe(true);
      expect(isMatching("/foo/baz?page=1")).toBe(true);
      expect(isMatching("/view")).toBe(false);
      expect(isMatching("/other-route")).toBe(false);
    });
  });

  describe.only("provides getUrl, which", () => {
    const getUrl = route.getUrl;

    it("builds an url for given params", () => {
      const url = getUrl({ bar: "some-value" });
      expect(url).toBe("/foo/some-value");
    });

    it("adds non-path params as query part of the url", () => {
      const url = getUrl({
        bar: "some-value",
        x: "plain-text",
        y: "needs encoding",
      });
      expect(url).toBe("/foo/some-value?x=plain-text&y=needs%20encoding");
    });
  });

  describe.only("provides getParams, which", () => {
    const getParams = route.getParams;

    it("extracts path params", () => {
      expect(getParams("/foo/baz")).toEqual({ bar: "baz" });
    });

    it("extracts query params alongside with path params", () => {
      expect(getParams("/foo/some-value?x=1&y=needs%20decoding")).toEqual({
        bar: "some-value",
        x: "1",
        y: "needs decoding",
      });
    });

    it("throws if url is not matching the route", () => {
      expect(() => getParams("/non-matching-route")).toThrow();
    });
  });
});
