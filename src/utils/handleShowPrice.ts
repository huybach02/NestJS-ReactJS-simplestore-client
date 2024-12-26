import {ProductType} from "@/types/productType";
import {formatMoney} from "./formatMoney";
import {checkHasSale} from "./checkHasSale";

export const handleShowPrice = (product: ProductType) => {
  const result: {
    originalPrice: string | null;
    salePrice?: string | null;
    minPrice?: string | null;
    maxPrice?: string | null;
  } = {
    originalPrice: null,
    salePrice: null,
    minPrice: null,
    maxPrice: null,
  };

  if (product.originalPrice && !product.hasVariant) {
    result.originalPrice = formatMoney(product.originalPrice);
    if (product.hasSale && checkHasSale(product)) {
      result.salePrice = formatMoney(product.salePrice || 0);
    }
  } else {
    if (product.variants.length === 1) {
      result.originalPrice = formatMoney(product.variants[0].originalPrice);
      if (product.variants[0].hasSale) {
        result.salePrice = formatMoney(product.variants[0].salePrice || 0);
      }
    } else {
      const prices =
        product.variants &&
        product.variants.map((variant) => {
          if (
            variant.hasSale &&
            checkHasSale(variant) &&
            variant.salePrice !== null
          ) {
            return variant.salePrice;
          }
          return variant.originalPrice;
        });

      if (prices && prices.length > 0) {
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        result.minPrice = formatMoney(minPrice);
        result.maxPrice = maxPrice !== minPrice ? formatMoney(maxPrice) : null;
      }
    }
  }
  return result;
};
