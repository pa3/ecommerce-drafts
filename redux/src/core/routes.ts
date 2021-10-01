import { match, compile, pathToRegexp, Key, Match } from "path-to-regexp";

type Routes = typeof routes[keyof typeof routes];
type ViewId = ReturnType<typeof createView>["id"];

export interface Route<Params> {
  viewId: ViewId;
  path: string;
  getParams: (url: string) => Params;
  getUrl: (params?: Record<string, string>) => string;
  isMatching: (url: string) => boolean;
}

export const makeRoute = <Params extends Record<string, string> | void, ViewID>(
  viewId: ViewID,
  path: string
) => {
  const pathKeys: Key[] = [];
  pathToRegexp(path, pathKeys);

  const pathParamsAllowMap = Object.fromEntries(
    pathKeys.map(({ name }) => [name, true])
  );

  const toPathname = compile(path);
  const matchPathname = match(path);

  const isMatching = (url: string) => {
    const [pathPart] = url.split("?");
    return Boolean(matchPathname(pathPart));
  };

  const getParams = (url: string): Params => {
    const [pathPart, queryPart] = url.split("?");
    const match: Match = matchPathname(pathPart);

    if (!match) throw new Error(`URL '${url}' does not match path '${path}'`);

    const pathParams = match.params;

    if (!queryPart) return pathParams as unknown as Params;

    const queryParams = Object.fromEntries(
      queryPart.split("&").map((queryEntry) => {
        const [name, value] = queryEntry.split("=");
        return [name, decodeURIComponent(value)];
      })
    );

    return {
      ...pathParams,
      ...queryParams,
    } as unknown as Params;
  };

  const getUrl = (params: Params) => {
    const pathPart = toPathname(params as any);
    const queryParams = Object.entries(params || {}).filter(
      ([name]) => !pathParamsAllowMap[name]
    );
    const queryPart = queryParams
      .map(([name, value]) => `${name}=${encodeURIComponent(value)}`)
      .join("&");

    if (queryPart.length > 0) return `${pathPart}?${queryPart}`;
    return pathPart;
  };

  const createView = (url: string) => ({
    id: viewId,
    params: getParams(url),
  });

  return {
    isMatching,
    getUrl,
    getParams,
    createView,
  };
};

export const routes = {
  product: makeRoute<{ productId: string }, "product">(
    "product",
    "/product/:productId"
  ),
  productList: makeRoute<void, "product-list">("product-list", "/products"),
};

export const getRoute = (url: string): Routes | undefined =>
  Object.values(routes).find((route) => route.isMatching(url));

export const createView = (url: string) => {
  const route = getRoute(url);
  if (!route) throw new Error("oupsy!");
  return route.createView(url);
};
