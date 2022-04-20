import { assignDeep } from "@/core/utils";

describe("assignDeep", () => {
  it("should assign provided diff deeply", () => {
    const obj = {
      foo: "foo",
      bar: {},
      baz: [],
      lol: "123",
    };

    const updated = assignDeep(obj, { bar: { baz: "new-baz" }, baz: [1, 2] });

    expect(updated).toEqual({
      foo: "foo",
      bar: {
        baz: "new-baz",
      },
      baz: [1, 2],
      lol: "123",
    });
  });

  it("should not mutate original object", () => {
    const obj = {
      foo: "foo",
      bar: {
        baz: "baz",
      },
    };

    assignDeep(obj, { bar: { baz: "new-baz" } });

    expect(obj).toEqual({
      foo: "foo",
      bar: {
        baz: "baz",
      },
    });
  });
});
