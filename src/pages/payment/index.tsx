/* eslint-disable @typescript-eslint/no-explicit-any */
import ContainerMain from "@/components/ContainerMain";
import SectionMain from "@/components/SectionMain";
import usePrice from "@/hooks/usePrice";
import {
  clearAboutToCart,
  setCartSelectedItems,
  setDiscountAmountAndFinalTotal,
  setVoucherUsed,
} from "@/redux/slice/cartSlice";
import {RootState} from "@/redux/store";
import {cartService} from "@/service/cartService";
import {CartItem} from "@/types/cartType";
import {calculateSubtotal} from "@/utils/calculateSubtotal";
import {formatMoney} from "@/utils/formatMoney";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Divider,
  Flex,
  Grid,
  Image,
  message,
  Modal,
  Result,
  Row,
  Table,
  Typography,
} from "antd";
import Head from "next/head";
import Link from "next/link";
import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {PayPalButtons, PayPalScriptProvider} from "@paypal/react-paypal-js";
import {orderService} from "@/service/orderService";
import useCart from "@/hooks/useCart";

const Payment = () => {
  const breadcrumbItems = [
    {
      title: <Link href="/">Home</Link>,
    },
    {
      title: <Link href="/cart">My Cart</Link>,
    },
    {
      title: "Shipping Information",
    },
    {
      title: "Payment",
    },
  ];

  const {getPrice} = usePrice();
  const {getCart} = useCart();
  const {cartSelectedItems, subTotal, discountAmount, finalTotal, voucherUsed} =
    useSelector((state: RootState) => state.cart);
  const [loading, setLoading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isConfirmOrder, setIsConfirmOrder] = useState(false);

  const columns = [
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: CartItem) => {
        const priceInfo = getPrice(record.product, record.variant);

        return (
          <Flex gap={15}>
            <Image
              src={
                !record.hasVariant
                  ? record.product.thumbnail ||
                    "https://www.eclosio.ong/wp-content/uploads/2018/08/default.png"
                  : record.variant?.thumbnail ||
                    record.product.thumbnail ||
                    "https://www.eclosio.ong/wp-content/uploads/2018/08/default.png"
              }
              alt={text}
              width={70}
              height={70}
              style={{objectFit: "contain", borderRadius: 5}}
              preview={false}
            />
            <Flex vertical gap={5}>
              <Typography.Text>{record.product.name}</Typography.Text>
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
                    textDecoration: priceInfo.salePrice ? "line-through" : "",
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                >
                  {formatMoney(priceInfo.originalPrice)}
                </Typography.Paragraph>
              </Flex>
              {record.hasVariant && (
                <Flex gap={20} align="center" style={{marginTop: -10}}>
                  <Typography.Paragraph style={{fontSize: 14}}>
                    <b>Version:</b> {record.variant?.name}
                  </Typography.Paragraph>
                  {record.variant?.sizes &&
                    record.variant?.sizes.length > 0 &&
                    record.size && (
                      <Typography.Paragraph style={{fontSize: 14}}>
                        <b>Size:</b> {record.size}
                      </Typography.Paragraph>
                    )}
                </Flex>
              )}
            </Flex>
          </Flex>
        );
      },
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (_text: number, record: CartItem) => {
        return <Typography.Text>{record.buyQuantity}</Typography.Text>;
      },
    },
    {
      title: "Subtotal",
      dataIndex: "subtotal",
      key: "subtotal",
      render: (_text: number, record: CartItem) => {
        const subtotal = calculateSubtotal(record);
        return (
          <Typography.Text>
            {subtotal ? formatMoney(subtotal) : "0"}
          </Typography.Text>
        );
      },
    },
  ];

  const {lg} = Grid.useBreakpoint();

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const fetchCartTemp = async () => {
      const result = await cartService.getCartTemp();
      if (result?.success) {
        dispatch(setCartSelectedItems(result?.data.products));
        if (result?.data.voucher) {
          dispatch(setVoucherUsed(result?.data.voucher));
        }
        dispatch(
          setDiscountAmountAndFinalTotal({
            subTotal: result?.data.subTotal,
            discountAmount: result?.data.discount,
            finalTotal: result?.data.totalAmount,
          })
        );
        setIsDataLoaded(true);
      } else {
        router.push("/cart");
      }
    };
    fetchCartTemp();
  }, []);

  const createOrder = async (paymentMethod: string, paymentStatus: string) => {
    const result = await orderService.createPaymentToken();
    await orderService.createOrder({
      token: result?.data,
      paymentMethod,
      paymentStatus,
    });
    await getCart();
    dispatch(clearAboutToCart());
  };

  const handlePaypalSuccess = async (details: any) => {
    try {
      setLoading(true);
      if (details.status === "COMPLETED") {
        await createOrder("paypal", "success");
        setPaymentSuccess(true);
      } else {
        message.error("Payment failed! Please try again.");
      }
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderPayPalButton = () => {
    if (!isDataLoaded || !finalTotal) {
      return null;
    }

    return (
      <PayPalScriptProvider
        options={{
          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
          currency: "USD",
          intent: "capture",
          components: "buttons",
        }}
      >
        <PayPalButtons
          style={{
            layout: "horizontal",
            height: 48,
          }}
          createOrder={(data, actions) => {
            // Kiểm tra lại một lần nữa
            if (!finalTotal || finalTotal <= 0) {
              alert("Invalid payment amount");
              return Promise.reject("Invalid payment amount");
            }

            const formattedAmount = Number(finalTotal).toFixed(2);

            return actions.order.create({
              intent: "CAPTURE",
              purchase_units: [
                {
                  amount: {
                    value: formattedAmount,
                    currency_code: "USD",
                  },
                },
              ],
            });
          }}
          onApprove={async (data, actions) => {
            const details = await actions.order?.capture();
            handlePaypalSuccess(details);
          }}
        />
      </PayPalScriptProvider>
    );
  };

  return (
    <>
      <Head>
        <title>Simple Store | Place Order</title>
      </Head>
      <Row>
        <ContainerMain>
          <SectionMain space={50}>
            <Breadcrumb items={breadcrumbItems} />
          </SectionMain>
          <SectionMain space={50} style={{position: "relative"}}>
            <Typography.Title level={2}>Place Order</Typography.Title>
            <Row gutter={[24, 24]}>
              <Col span={lg ? 18 : 24} order={lg ? 1 : 2}>
                <Flex vertical gap={30}>
                  <Flex vertical gap={10}>
                    <Typography.Title level={4}>Product List</Typography.Title>
                    <Table
                      size="small"
                      dataSource={cartSelectedItems}
                      columns={columns}
                      loading={loading}
                      rowKey="id"
                      scroll={{
                        x: "max-content",
                      }}
                      pagination={false}
                    />
                  </Flex>
                  <Flex vertical gap={10}>
                    <Typography.Title level={4}>
                      Choose Payment Method
                    </Typography.Title>
                    <Flex gap={20}>
                      <Button
                        type={isConfirmOrder ? "primary" : "default"}
                        size="large"
                        style={{width: "200px", height: "50px"}}
                        onClick={() => setIsConfirmOrder(true)}
                      >
                        Cash on Delivery
                      </Button>
                      <div style={{width: "200px", height: "100px"}}>
                        {renderPayPalButton()}
                      </div>
                    </Flex>

                    <Typography.Text>
                      <b>Paypal Account Demo:</b>
                    </Typography.Text>
                    <Typography.Text>
                      Email: {process.env.NEXT_PUBLIC_EMAIL_PAYPAL_DEMO}
                    </Typography.Text>
                    <Typography.Text>
                      Password: {process.env.NEXT_PUBLIC_PASSWORD_PAYPAL_DEMO}
                    </Typography.Text>
                  </Flex>
                </Flex>
              </Col>
              <Col span={lg ? 6 : 24} order={lg ? 2 : 1}>
                <Card
                  title="Summary"
                  style={{
                    boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
                    position: "sticky",
                    top: 100,
                  }}
                >
                  <Flex justify="space-between">
                    <Typography.Paragraph style={{fontWeight: 600}}>
                      Subtotal:{" "}
                    </Typography.Paragraph>
                    <Typography.Text style={{fontWeight: 700}}>
                      {formatMoney(subTotal || 0)}
                    </Typography.Text>
                  </Flex>
                  <Divider style={{marginTop: "10px"}} />
                  <Flex justify="space-between" gap={10}>
                    <Typography.Text style={{fontWeight: 600}}>
                      Voucher:{" "}
                    </Typography.Text>
                    <Flex gap={10}>
                      <Typography.Text>{voucherUsed?.code}</Typography.Text>
                    </Flex>
                  </Flex>
                  <Flex justify="space-between" style={{marginTop: "20px"}}>
                    <Typography.Text style={{fontWeight: 600}}>
                      Discount:{" "}
                    </Typography.Text>
                    <Typography.Text style={{fontWeight: 700}}>
                      - {formatMoney(discountAmount || 0)}
                    </Typography.Text>
                  </Flex>
                  <Divider style={{marginTop: "20px"}} />
                  <Flex justify="space-between">
                    <Typography.Text style={{fontWeight: 700, fontSize: 20}}>
                      Total:{" "}
                    </Typography.Text>
                    <Typography.Text style={{fontWeight: 700, fontSize: 20}}>
                      {formatMoney(finalTotal || 0)}
                    </Typography.Text>
                  </Flex>
                </Card>
                {isConfirmOrder && (
                  <Button
                    type="primary"
                    size="large"
                    style={{width: "100%", marginTop: "20px"}}
                    onClick={async () => {
                      await createOrder("cod", "pending");
                      setPaymentSuccess(true);
                    }}
                  >
                    Confirm Order
                  </Button>
                )}
              </Col>
            </Row>
          </SectionMain>
        </ContainerMain>
      </Row>
      <Modal
        open={paymentSuccess}
        onCancel={() => {
          setPaymentSuccess(true);
        }}
        onOk={() => {
          setPaymentSuccess(false);
        }}
        title=""
        footer={null}
      >
        <Result
          status="success"
          title="Place Order Success"
          subTitle="Your order has been placed successfully."
          extra={[
            <Flex vertical key="extra" gap={10}>
              <Button
                type="primary"
                key="console"
                size="large"
                onClick={() => {
                  router.push("/orders");
                }}
              >
                View Details Order
              </Button>

              <Button
                key="buy"
                size="large"
                style={{width: "100%"}}
                onClick={() => {
                  router.push("/");
                }}
              >
                Back to Home
              </Button>
            </Flex>,
          ]}
        />
      </Modal>
    </>
  );
};

export default Payment;
