import {ProductType} from "@/types/productType";
import {ProductVariantType} from "@/types/productVariantType";
import {checkHasSale} from "@/utils/checkHasSale";

const usePrice = () => {
  const getPrice = (
    product: ProductType,
    selectedVariant: ProductVariantType | null
  ) => {
    if (!product.hasVariant) {
      return {
        originalPrice: product.originalPrice,
        salePrice:
          product.hasSale && checkHasSale(product) ? product.salePrice : null,
      };
    } else {
      return {
        originalPrice: selectedVariant?.originalPrice ?? 0,
        salePrice:
          selectedVariant?.hasSale && checkHasSale(selectedVariant)
            ? selectedVariant.salePrice
            : null,
      };
    }
  };

  return {getPrice};
};

export default usePrice;
