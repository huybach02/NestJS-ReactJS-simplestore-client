import {ProductType} from "@/types/productType";
import {ProductVariantType} from "@/types/productVariantType";

export const checkHasSale = (item: ProductType | ProductVariantType) => {
  const now = new Date();
  const startDate = item.saleStartDate ? new Date(item.saleStartDate) : null;
  const endDate = item.saleEndDate ? new Date(item.saleEndDate) : null;
  return startDate && endDate && now >= startDate && now <= endDate;
};

export const checkProductHasVariantSale = (product: ProductType) => {
  return product.variants.some(
    (variant) => variant.hasSale && checkHasSale(variant)
  );
};

export const countVariantSale = (product: ProductType) => {
  return product.variants.filter(
    (variant) => variant.hasSale && checkHasSale(variant)
  ).length;
};
