/* Utility types */

type Prev = [
  never,
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  ...0[]
];

type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${"" extends P ? "" : "."}${P}`
    : never
  : never;

export type Paths<T, D extends number = 10> = [D] extends [never]
  ? never
  : T extends object
  ? {
      [K in keyof T]-?: K extends string | number
        ? `${K}` | Join<K, Paths<T[K], Prev[D]>>
        : never;
    }[keyof T]
  : "";

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

/* Utility functions */

function uniq<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

export function assignDeep<T>(dest: T, change: DeepPartial<T>): T {
  const allKeys = uniq([...Object.keys(dest), ...Object.keys(change)]);
  return Object.fromEntries(
    allKeys.map((key) => {
      const oldValue = dest[key as keyof T];
      const newValue = change[key as keyof T] as unknown as DeepPartial<
        T[keyof T]
      >;
      if (newValue) {
        const nextValue =
          Array.isArray(oldValue) || typeof oldValue !== "object"
            ? newValue
            : assignDeep(oldValue, newValue);
        return [key, nextValue];
      }
      return [key, oldValue];
    })
  ) as any as T;
}
