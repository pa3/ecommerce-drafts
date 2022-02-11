import { match, compile, pathToRegexp, Key } from "path-to-regexp";

export interface Route<Params> {
  getParams: (url: string) => Params;
  getUrl: (params: Params) => string;
  isMatching: (url: string) => boolean;
}

type RawParams<Params> = Record<keyof Params, string>;

export function makeRoute(path: string): Route<void>;

export function makeRoute<Params extends Record<string, string>>(
  path: string
): Route<Params>;

// An overload making sure that encode/decode functions are provided
// if route parameter values are not all strings
export function makeRoute<Params extends Record<string, unknown>>(
  path: string,
  encodeParams: (params: Params) => RawParams<Params>,
  decodeParams: (rawParams: RawParams<Params>) => Params
): Route<Params>;

export function makeRoute<Params>(
  path: string,
  encodeParams?: (params: Params) => RawParams<Params>,
  decodeParams?: (rawParams: RawParams<Params>) => Params
): Route<Params> {
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

  function getParams(url: string): Params {
    const [pathPart, queryPart] = url.split("?");
    const match = matchPathname(pathPart) as
      | { params: Record<keyof Params, string> }
      | undefined;

    if (!match) throw new Error(`URL '${url}' does not match path '${path}'`);

    const queryParams = queryPart
      ? Object.fromEntries(
          queryPart.split("&").map((queryEntry) => {
            const [name, value] = queryEntry.split("=");
            return [name, decodeURIComponent(value)];
          })
        )
      : {};

    const params = {
      ...match.params,
      ...queryParams,
    };

    return decodeParams ? decodeParams(params) : (params as unknown as Params);
  }

  function getUrl(params: Params) {
    const encoded = encodeParams ? encodeParams(params) : params;

    const pathPart = toPathname(encoded as object);
    const queryParams = Object.entries<string>(encoded || {}).filter(
      ([name]) => !pathParamsAllowMap[name]
    );
    const queryPart = queryParams
      .map(([name, value]) => `${name}=${encodeURIComponent(value)}`)
      .join("&");

    if (queryPart.length > 0) return `${pathPart}?${queryPart}`;

    return pathPart;
  }

  return {
    isMatching,
    getUrl,
    getParams,
  };
}

export function findMatchingRoute<R extends Route<any>>(
  routes: R[],
  url: string
): R | undefined {
  return routes.find((route) => route.isMatching(url));
}
