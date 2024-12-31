/* eslint-disable @typescript-eslint/no-explicit-any */
import ContainerMain from "@/components/ContainerMain";
import SectionMain from "@/components/SectionMain";
import useCart from "@/hooks/useCart";
import usePrice from "@/hooks/usePrice";
import {cartService} from "@/service/cartService";
import {CartItem} from "@/types/cartType";
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
  Input,
  InputNumber,
  List,
  message,
  Popconfirm,
  Row,
  Table,
  Typography,
} from "antd";
import Head from "next/head";
import Link from "next/link";
import {useEffect, useState} from "react";
import {FiTrash2} from "react-icons/fi";
import {calculateSubtotal, calculateTotal} from "../../utils/calculateSubtotal";
import {debounce} from "@/utils/debounce";
import {useDispatch} from "react-redux";
import {
  setCartSelectedItems,
  setDiscountAmountAndFinalTotal,
  setVoucherUsed,
} from "@/redux/slice/cartSlice";
import {TiTicket} from "react-icons/ti";
import {FaRegCopy} from "react-icons/fa";
import useSelection from "@/hooks/useSelection";
import {useRouter} from "next/router";

const Cart = () => {
  const breadcrumbItems = [
    {
      title: <Link href="/">Home</Link>,
    },
    {
      title: "My Cart",
    },
  ];

  const dispatch = useDispatch();
  const router = useRouter();

  const {lg} = Grid.useBreakpoint();

  const {getPrice} = usePrice();

  const [loading, setLoading] = useState(false);
  const [voucher, setVoucher] = useState("");
  const [vouchers, setVouchers] = useState([]);

  const {
    cart,
    handleRemoveFromCart,
    voucherUsed,
    subTotal,
    discountAmount,
    finalTotal,
    handleUpdateCart,
    handleClearAll,
  } = useCart({
    setLoading,
  });

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
        return (
          <>
            <Flex gap={10} align="center">
              <Button
                size="small"
                onClick={() =>
                  record.buyQuantity > 1 &&
                  handleUpdateCart(record.id, record.buyQuantity - 1)
                }
              >
                -
              </Button>
              <InputNumber
                value={record.buyQuantity}
                onChange={(value) => {
                  if (value) {
                    const debouncedUpdate = debounce(
                      () => handleUpdateCart(record.id, value),
                      500
                    );
                    debouncedUpdate();
                  }
                }}
                min={1}
                max={
                  record.hasVariant
                    ? record.variant?.quantity
                    : record.product.quantity
                }
                style={{width: 80}}
                controls={false}
              />
              <Button
                size="small"
                onClick={() => {
                  if (
                    !record.hasVariant &&
                    record.buyQuantity < record.product.quantity
                  ) {
                    handleUpdateCart(record.id, record.buyQuantity + 1);
                  } else if (
                    record.hasVariant &&
                    record.variant?.quantity &&
                    record.buyQuantity < record.variant?.quantity
                  ) {
                    handleUpdateCart(record.id, record.buyQuantity + 1);
                  }
                }}
              >
                +
              </Button>
            </Flex>
          </>
        );
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
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_text: string, record: CartItem) => {
        return (
          <Button
            size="small"
            danger
            onClick={() => {
              handleRemoveFromCart(record.id);
            }}
          >
            <FiTrash2 />
          </Button>
        );
      },
    },
  ];

  const {rowSelection, selectedRowKeys} = useSelection();

  const handleCheckout = async () => {
    if (selectedRowKeys.length === 0) {
      message.error("Please select at least one item to checkout");
      return;
    }
    setLoading(true);
    const result = await cartService.placeOrder({
      selectedItems: selectedRowKeys,
      voucher: voucherUsed ? voucherUsed._id : null,
    });
    if (result?.success) {
      router.push("/place-order");
    } else {
      setVoucher("");
      dispatch(setVoucherUsed(null));
      dispatch(
        setDiscountAmountAndFinalTotal({
          subTotal: calculateTotal(selectedRowKeys, cart),
          discountAmount: 0,
          finalTotal: calculateTotal(selectedRowKeys, cart),
        })
      );
    }
    setLoading(false);
  };

  const handleApplyVoucher = async () => {
    if (!voucher || selectedRowKeys.length === 0) {
      message.error("Please enter voucher code and select items to apply");
      return;
    }
    setLoading(true);
    const result = await cartService.applyVoucher(voucher, selectedRowKeys);
    dispatch(setVoucherUsed(result?.data.voucher));
    dispatch(
      setDiscountAmountAndFinalTotal({
        subTotal: result?.data.subTotal,
        discountAmount: result?.data.discountAmount,
        finalTotal: result?.data.finalTotal,
      })
    );
    setLoading(false);
  };

  useEffect(() => {
    dispatch(
      setCartSelectedItems(
        cart.filter((item) => selectedRowKeys.includes(item.id))
      )
    );
    if (voucher && selectedRowKeys.length > 0) {
      handleApplyVoucher();
    }
  }, [selectedRowKeys, cart, dispatch]);

  useEffect(() => {
    const fetchVouchers = async () => {
      const result = await cartService.getAllVoucher();
      setVouchers(result?.data);
    };
    fetchVouchers();
  }, []);

  return (
    <>
      <Head>
        <title>Simple Store | My Cart</title>
      </Head>
      <Row>
        <ContainerMain>
          <SectionMain space={50}>
            <Breadcrumb items={breadcrumbItems} />
          </SectionMain>
          <SectionMain space={50} style={{position: "relative"}}>
            <Typography.Title level={2}>My Cart</Typography.Title>
            <Row gutter={[24, 24]}>
              <Col span={lg ? 18 : 24} order={lg ? 1 : 2}>
                <Flex justify="end" style={{marginBottom: 20}}>
                  <Popconfirm
                    title="Clear all items"
                    description="Are you sure to clear all items?"
                    onConfirm={handleClearAll}
                    onCancel={() => {}}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button
                      size="middle"
                      danger
                      icon={<FiTrash2 />}
                      disabled={loading}
                    >
                      Clear All
                    </Button>
                  </Popconfirm>
                </Flex>
                <Table
                  dataSource={cart}
                  columns={columns}
                  loading={loading}
                  rowKey="id"
                  scroll={{
                    x: "max-content",
                  }}
                  pagination={false}
                  rowSelection={rowSelection}
                />
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
                      {formatMoney(
                        subTotal || calculateTotal(selectedRowKeys, cart)
                      )}
                    </Typography.Text>
                  </Flex>
                  <Divider style={{marginTop: "10px"}} />
                  <Flex vertical gap={10}>
                    <Typography.Text style={{fontWeight: 600}}>
                      Voucher:{" "}
                    </Typography.Text>
                    <Flex gap={10}>
                      <Input
                        placeholder="Enter voucher code"
                        size="large"
                        value={voucher}
                        onChange={(e) => setVoucher(e.target.value)}
                        disabled={loading}
                      />
                      <Button
                        size="large"
                        onClick={handleApplyVoucher}
                        loading={loading}
                      >
                        Apply
                      </Button>
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
                      {formatMoney(
                        finalTotal || calculateTotal(selectedRowKeys, cart)
                      )}
                    </Typography.Text>
                  </Flex>
                  <Button
                    size="large"
                    style={{marginTop: "20px", width: "100%"}}
                    type="primary"
                    onClick={() => {
                      handleCheckout();
                    }}
                    disabled={loading}
                  >
                    Place Order
                  </Button>

                  <List
                    size="small"
                    itemLayout="horizontal"
                    dataSource={vouchers}
                    style={{marginTop: 40, display: lg ? "block" : "none"}}
                    renderItem={(item: any) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<TiTicket size={20} />}
                          title={
                            <Typography.Text style={{fontSize: 14}}>
                              {item.title}
                            </Typography.Text>
                          }
                          description={
                            <Flex justify="space-between">
                              <Flex vertical gap={5}>
                                <Typography.Text style={{fontSize: 12}}>
                                  Code: {item.code}
                                </Typography.Text>
                                <Typography.Text style={{fontSize: 12}}>
                                  Discount:{" "}
                                  {item.typeDiscount === "percentage"
                                    ? item.valueDiscount + "%"
                                    : formatMoney(item.valueDiscount)}
                                </Typography.Text>
                                <Typography.Text style={{fontSize: 12}}>
                                  Min Amount of Order:{" "}
                                  {formatMoney(item.minAmountOfOrder)}
                                </Typography.Text>
                                <Typography.Text style={{fontSize: 12}}>
                                  Max Discount: {formatMoney(item.maxDiscount)}
                                </Typography.Text>
                              </Flex>
                              <Button
                                size="middle"
                                icon={<FaRegCopy />}
                                onClick={() => {
                                  navigator.clipboard.writeText(item.code);
                                  message.success("Copied to clipboard");
                                }}
                              />
                            </Flex>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
          </SectionMain>
        </ContainerMain>
      </Row>
    </>
  );
};

export default Cart;
