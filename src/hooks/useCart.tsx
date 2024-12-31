import {setCart} from "@/redux/slice/cartSlice";
import {RootState} from "@/redux/store";
import {cartService} from "@/service/cartService";
import {AddToCartItem} from "@/types/cartType";
import {ProductType} from "@/types/productType";
import {ProductVariantType} from "@/types/productVariantType";
import {generateRandomId} from "@/utils/generateId";
import {message} from "antd";
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";

const useCart = ({
  setLoading,
}: {setLoading?: (loading: boolean) => void} = {}) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const cart = useSelector((state: RootState) => state.cart.cart);
  const voucherUsed = useSelector((state: RootState) => state.cart.voucherUsed);
  const discountAmount = useSelector(
    (state: RootState) => state.cart.discountAmount
  );
  const subTotal = useSelector((state: RootState) => state.cart.subTotal);
  const finalTotal = useSelector((state: RootState) => state.cart.finalTotal);
  const user = useSelector((state: RootState) => state.user.user);

  const getCart = async () => {
    setLoading?.(true);
    const cart = await cartService.getCart();
    if (cart && "success" in cart) {
      dispatch(setCart(cart.data));
    }
    setLoading?.(false);
  };

  const handleAddToCart = async (
    product: ProductType,
    selectedVariant: ProductVariantType | null,
    selectedSize: string | null,
    quantity: number
  ) => {
    if (!user) {
      message.error("Please login first to add to cart");
      router.push(`/auth/login?product=${product.slug}`);
      return;
    }

    if (
      !selectedSize &&
      product.hasVariant &&
      selectedVariant?.sizes &&
      selectedVariant?.sizes.length > 0
    ) {
      message.error("Please select size");
      return;
    }

    const item: AddToCartItem = {
      userId: user?._id ?? "",
      id: generateRandomId(12),
      productId: product._id,
      buyQuantity: quantity,
      hasVariant: product.hasVariant,
      variant: selectedVariant
        ? {
            variantId: selectedVariant._id,
            size: selectedSize ?? "",
          }
        : null,
    };

    await cartService.addToCart(item);
    getCart();
  };

  const handleRemoveFromCart = async (itemId: string) => {
    await cartService.removeFromCart(itemId);
    getCart();
  };

  const handleUpdateCart = async (itemId: string, quantity: number) => {
    await cartService.updateCart(itemId, quantity);
    await getCart();
  };

  const handleClearAll = async () => {
    await cartService.clearAllCart();
    await getCart();
  };

  return {
    cart,
    getCart,
    handleAddToCart,
    handleRemoveFromCart,
    voucherUsed,
    subTotal,
    discountAmount,
    finalTotal,
    handleUpdateCart,
    handleClearAll,
  };
};

export default useCart;
