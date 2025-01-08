import {ProductType} from "@/types/productType";

export const findMaxPrice = (products: ProductType[]) => {
  let maxPrice = 0;

  products.forEach((product) => {
    if (!product.hasVariant) {
      if (product.hasSale) {
        if (product.salePrice) {
          maxPrice = product.salePrice;
        }
      } else {
        if (product.originalPrice) {
          maxPrice = product.originalPrice;
        }
      }
    } else {
      product.variants.forEach((variant) => {
        if (variant.hasSale) {
          if (variant.salePrice) {
            maxPrice = variant.salePrice;
          }
        } else {
          if (variant.originalPrice) {
            maxPrice = variant.originalPrice;
          }
        }
      });
    }
  });

  return maxPrice;
};
