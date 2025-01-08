import useCart from "@/hooks/useCart";
import usePrice from "@/hooks/usePrice";
import {setCloseMiniCart} from "@/redux/slice/dataSlice";
import {RootState} from "@/redux/store";
import {formatMoney} from "@/utils/formatMoney";
import {Button, Card, Col, Drawer, Flex, Image, Row, Typography} from "antd";
import Link from "next/link";
import {useRouter} from "next/router";
import {useEffect} from "react";
import {FiTrash2} from "react-icons/fi";
import {useDispatch, useSelector} from "react-redux";

const MiniCart = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const {showMiniCart} = useSelector((state: RootState) => state.data);
  const {user} = useSelector((state: RootState) => state.user);
  const {cart, handleRemoveFromCart} = useCart();

  const {getPrice} = usePrice();

  useEffect(() => {
    if (router.pathname === "/cart") {
      dispatch(setCloseMiniCart());
    }
  }, [router.pathname, showMiniCart, dispatch]);

  return (
    <Drawer
      title="My Cart"
      onClose={() => dispatch(setCloseMiniCart())}
      open={showMiniCart}
      width={500}
    >
      <div style={{height: "90%", overflow: "auto"}}>
        {cart.length > 0 ? (
          cart.map((product, index) => {
            const priceInfo = getPrice(product.product, product.variant);
            return (
              <Card
                key={index}
                style={{
                  marginBottom: 10,
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Row>
                  <Col span={4}>
                    <Image
                      src={
                        !product.hasVariant
                          ? product.product.thumbnail ||
                            "https://www.eclosio.ong/wp-content/uploads/2018/08/default.png"
                          : product.variant?.thumbnail ||
                            product.product.thumbnail ||
                            "https://www.eclosio.ong/wp-content/uploads/2018/08/default.png"
                      }
                      alt={product.product.name || ""}
                      width={"100%"}
                      preview={false}
                      style={{
                        objectFit: "contain",
                        borderRadius: "10px",
                        padding: 2,
                        border: "1px solid #e0e0e0",
                      }}
                    />
                  </Col>
                  <Col span={1}></Col>
                  <Col span={17}>
                    <Flex vertical gap={2}>
                      <Typography.Text style={{fontSize: 14}}>
                        {product.product.name}
                      </Typography.Text>

                      <Flex gap={15} style={{marginBottom: 0}}>
                        {priceInfo.salePrice && (
                          <Typography.Paragraph
                            style={{
                              fontSize: 14,
                              fontWeight: 600,
                              color: "red",
                            }}
                          >
                            {formatMoney(priceInfo.salePrice)}
                          </Typography.Paragraph>
                        )}
                        <Typography.Paragraph
                          style={{
                            textDecoration: priceInfo.salePrice
                              ? "line-through"
                              : "",
                            fontSize: 14,
                            fontWeight: 500,
                          }}
                        >
                          {formatMoney(priceInfo.originalPrice)}
                        </Typography.Paragraph>
                      </Flex>
                    </Flex>

                    <Typography.Paragraph
                      style={{fontSize: 14, marginTop: -10}}
                    >
                      <b>Quantity:</b> {product.buyQuantity}
                    </Typography.Paragraph>
                    {product.hasVariant && (
                      <Flex gap={20} align="center" style={{marginTop: -10}}>
                        <Typography.Paragraph style={{fontSize: 14}}>
                          <b>Version:</b> {product.variant?.name}
                        </Typography.Paragraph>
                        {product.variant?.sizes &&
                          product.variant?.sizes.length > 0 &&
                          product.size && (
                            <Typography.Paragraph style={{fontSize: 14}}>
                              <b>Size:</b> {product.size}
                            </Typography.Paragraph>
                          )}
                      </Flex>
                    )}
                  </Col>
                  <Col span={2}>
                    <Button
                      size="small"
                      type="default"
                      danger
                      onClick={() => handleRemoveFromCart(product.id)}
                    >
                      <FiTrash2 size={14} />
                    </Button>
                  </Col>
                </Row>
              </Card>
            );
          })
        ) : (
          <p>No items in cart</p>
        )}
      </div>

      <Flex justify="end" gap={10} style={{marginTop: 40}}>
        <Button
          type="text"
          size="middle"
          onClick={() => dispatch(setCloseMiniCart())}
        >
          Cancel
        </Button>
        <Link href={user ? "/cart" : "/auth/login"}>
          <Button type="primary" size="middle">
            Go to Cart
          </Button>
        </Link>
      </Flex>
    </Drawer>
  );
};

export default MiniCart;
