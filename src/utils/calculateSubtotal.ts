import {CartItem} from "@/types/cartType";
import {checkHasSale} from "./checkHasSale";
import {Key} from "antd/es/table/interface";

export const calculateSubtotal = (item: CartItem) => {
  if (!item.product.hasVariant) {
    if (item.product.hasSale && checkHasSale(item.product)) {
      return (
        item.product?.salePrice && item.product?.salePrice * item.buyQuantity
      );
    } else {
      return (
        item.product?.originalPrice &&
        item.product?.originalPrice * item.buyQuantity
      );
    }
  } else {
    if (item.variant?.hasSale && checkHasSale(item.variant)) {
      return (
        item.variant?.salePrice && item.variant?.salePrice * item.buyQuantity
      );
    } else {
      return (
        item.variant?.originalPrice &&
        item.variant?.originalPrice * item.buyQuantity
      );
    }
  }
};

export const calculateTotal = (selectedRows: Key[], cart: CartItem[]) => {
  const selectedItems = cart.filter((item) => selectedRows.includes(item.id));

  let total = 0;

  selectedItems.forEach((item) => {
    total += calculateSubtotal(item) || 0;
  });

  return total;
};
