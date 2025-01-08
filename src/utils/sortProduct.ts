import {ProductType} from "@/types/productType";

export const getSortedProducts = (products: ProductType[], sort: string) => {
  const sortedProducts = [...products];
  switch (sort) {
    case "oldest":
      return sortedProducts.sort(
        (a, b) =>
          new Date(a.createdAt.toString()).getTime() -
          new Date(b.createdAt.toString()).getTime()
      );
    default: // newest
      return sortedProducts.sort(
        (a, b) =>
          new Date(b.createdAt.toString()).getTime() -
          new Date(a.createdAt.toString()).getTime()
      );
  }
};
