import { Product } from "@/core/products";
import { ProductType } from "@/core/product-types";
import crypto from "crypto";

const tshirts: ProductType = {
  id: crypto.randomUUID(),
  name: "T-Shirts",
  attributes: [
    {
      id: "size",
      name: "Size",
      required: true,
      type: "enum",
      values: [
        { id: "s", name: "S" },
        { id: "m", name: "M" },
        { id: "l", name: "L" },
        { id: "xl", name: "XL" },
        { id: "xxl", name: "XXL" },
      ],
    },
    {
      id: "color",
      name: "Color",
      required: true,
      type: "text",
    },
  ],
};

const keyboards: ProductType = {
  id: crypto.randomUUID(),
  name: "Keyboards",
  attributes: [
    {
      id: "amount-of-keys",
      name: "Amount of keys",
      type: "number",
    },
    {
      id: "clicky",
      name: "Is it clicky?",
      type: "boolean",
    },
  ],
};

const bicycles: ProductType = {
  id: crypto.randomUUID(),
  name: "Bicycles",
  attributes: [
    {
      id: "frame-size",
      name: "Frame size (cm)",
      required: true,
      type: "number",
    },
    {
      id: "weight",
      name: "Weight (kg)",
      type: "number",
    },
  ],
};

const knownProductTypes = {
  [tshirts.id]: tshirts,
  [keyboards.id]: keyboards,
  [bicycles.id]: bicycles,
};

const catchyAdjectives = [
  "Beautiful",
  "Best",
  "Brilliant",
  "Epic",
  "Essential",
  "Excellent",
  "Fails",
  "Fantastic",
  "Free",
  "Gorgeous",
  "Great",
  "Horrific",
  "Horrifying",
  "Important",
  "Inspire",
  "Kickass",
  "Killer",
  "Know",
  "Lousy",
  "Mindblowing",
  "Most",
  "Persuasive",
  "Simple",
  "Success",
  "Ultimate",
  "Useful",
  "Valuable",
];

function getRandomElement<T>(arr: T[]): T {
  const i = Math.floor(Math.random() * arr.length);
  return arr[i];
}

function getProductName(productTypeId: string): string {
  switch (productTypeId) {
    case tshirts.id:
      return `${getRandomElement(catchyAdjectives)} t-shrit`;
    case keyboards.id:
      return `${getRandomElement(catchyAdjectives)} keyboard`;
    default:
      return `${getRandomElement(catchyAdjectives)} bicycle`;
  }
}

export function makeProduct(
  fixed: {
    productTypeId?: string;
    name?: string;
  } = {}
): Product {
  const productTypeId = fixed.productTypeId || bicycles.id;
  const name = fixed.name || getProductName(productTypeId);
  const type = knownProductTypes[productTypeId];

  return {
    id: crypto.randomUUID(),
    name,
    price: Math.round(Math.random() * 1000),
    type,
    attributes: {},
  };
}
