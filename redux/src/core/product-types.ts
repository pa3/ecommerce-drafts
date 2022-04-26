export type EnumAttribute = {
  type: "enum";
  values: Array<{ id: string; name: string }>;
};

export type SimpleAttribute = { type: "text" | "number" | "boolean" };

export type ProductAttribute = {
  id: string;
  name: string;
  required?: boolean;
} & (EnumAttribute | SimpleAttribute);

export type ProductType = {
  id: string;
  name: string;
  attributes: ProductAttribute[];
};
