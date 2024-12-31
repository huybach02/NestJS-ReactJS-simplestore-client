import {ProductType} from "./productType";
import {ProductVariantType} from "./productVariantType";

export type AddToCartItem = {
  userId: string;
  id: string;
  productId: string;
  buyQuantity: number | null;
  hasVariant: boolean;
  variant: {
    variantId: string;
    size: string;
  } | null;
  size?: string;
};

export type CartItem = {
  id: string;
  product: ProductType;
  hasVariant: boolean;
  buyQuantity: number;
  variant: ProductVariantType | null;
  size: string | null;
};
