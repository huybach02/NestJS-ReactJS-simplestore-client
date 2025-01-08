/* eslint-disable @typescript-eslint/no-explicit-any */
import {ProductType} from "@/types/productType";

export const filterByPrice = (
  products: ProductType[],
  minPrice: number,
  maxPrice: number
) => {
  return products.filter((product) => {
    const priceMatch = !product.hasVariant
      ? product.hasSale
        ? product.salePrice &&
          product.salePrice >= +minPrice &&
          product.salePrice <= +maxPrice
        : product.originalPrice &&
          product.originalPrice >= +minPrice &&
          product.originalPrice <= +maxPrice
      : product.variants.some((variant) =>
          variant.hasSale
            ? variant.salePrice &&
              variant.salePrice >= +minPrice &&
              variant.salePrice <= +maxPrice
            : variant.originalPrice &&
              variant.originalPrice >= +minPrice &&
              variant.originalPrice <= +maxPrice
        );
    return priceMatch;
  });
};
