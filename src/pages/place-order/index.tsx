import AddAddressForm from "@/components/AddAddressForm";
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
import {orderService} from "@/service/orderService";
import {AddressType} from "@/types/addressType";
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
  Form,
  Grid,
  Image,
  message,
  Modal,
  Row,
  Table,
  Typography,
} from "antd";
import Head from "next/head";
import Link from "next/link";
import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import {FiPlusCircle, FiTrash2} from "react-icons/fi";
import {useDispatch, useSelector} from "react-redux";

const PlaceOrder = () => {
  const breadcrumbItems = [
    {
      title: <Link href="/">Home</Link>,
    },
    {
      title: <Link href="/cart">My Cart</Link>,
    },
    {
      title: "Place Order",
    },
  ];

  const [form] = Form.useForm();

  const {getPrice} = usePrice();
  const {cartSelectedItems, subTotal, discountAmount, finalTotal, voucherUsed} =
    useSelector((state: RootState) => state.cart);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<AddressType | null>(
    null
  );

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

  const [address, setAddress] = useState<AddressType[]>([]);

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
      } else {
        router.push("/cart");
      }
    };
    fetchCartTemp();
    fetchAddress();
  }, []);

  const fetchAddress = async () => {
    const result = await orderService.getAddress();
    if (result?.success) {
      setAddress(result?.data);
    }
  };

  const onSubmit = async (values: AddressType) => {
    setLoading(true);
    await orderService.addAddress(values);
    setLoading(false);
    setOpen(false);
    form.resetFields();
    fetchAddress();
  };

  const handleGoToPayment = async () => {
    const result = await orderService.checkVoucher();
    if (result?.success) {
      if (selectedAddress) {
        await orderService.selectAddress(selectedAddress);
        router.push("/payment");
      } else {
        message.error("Please select an address to continue");
      }
    } else {
      dispatch(clearAboutToCart());
      router.push("/cart");
    }
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
                  <Flex justify="space-between" align="center">
                    <Typography.Title level={4}>
                      Choose Shipping Address
                    </Typography.Title>
                    <Button
                      icon={<FiPlusCircle />}
                      onClick={() => setOpen(true)}
                    >
                      Add new address
                    </Button>
                  </Flex>

                  <Row gutter={[24, 24]}>
                    {address.map((item) => (
                      <Col span={lg ? 8 : 24} key={item._id}>
                        <Card
                          size="small"
                          style={{
                            border:
                              selectedAddress?._id === item._id
                                ? "2px solid #000"
                                : "",
                          }}
                        >
                          <Flex justify="space-between">
                            <Typography.Title level={5}>
                              {item.receiver}
                            </Typography.Title>
                            <Button
                              size="middle"
                              type={
                                selectedAddress?._id === item._id
                                  ? "primary"
                                  : "default"
                              }
                              onClick={() => setSelectedAddress(item)}
                            >
                              {selectedAddress?._id === item._id
                                ? "Selected"
                                : "Select"}
                            </Button>
                          </Flex>
                          <Divider style={{margin: "10px 0"}} />
                          <Flex vertical gap={5}>
                            <Typography.Text>
                              <b>Receiver:</b> {item.receiver}
                            </Typography.Text>
                            <Typography.Text>
                              <b>Phone:</b> {item.phone}
                            </Typography.Text>
                            <Typography.Text>
                              <b>Commune/Ward:</b> {item.ward}
                            </Typography.Text>
                            <Typography.Text>
                              <b>District:</b> {item.district}
                            </Typography.Text>
                            <Typography.Text>
                              <b>Province/City:</b> {item.province}
                            </Typography.Text>
                            <Typography.Text>
                              <b>Address:</b> {item.address}
                            </Typography.Text>
                            <Typography.Text>
                              <b>* Note:</b> {item.note}
                            </Typography.Text>
                          </Flex>
                          <Divider style={{marginTop: "10px"}} />
                          <Flex justify="space-between">
                            <Button
                              size="small"
                              danger
                              icon={<FiTrash2 />}
                              onClick={async () => {
                                await orderService.deleteAddress(item._id!);
                                fetchAddress();
                              }}
                            />
                          </Flex>
                        </Card>
                      </Col>
                    ))}
                  </Row>
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
                  <Button
                    size="large"
                    style={{marginTop: "20px", width: "100%"}}
                    type="primary"
                    onClick={() => {
                      handleGoToPayment();
                    }}
                    disabled={loading}
                  >
                    Go to payment
                  </Button>
                </Card>
              </Col>
            </Row>
          </SectionMain>
        </ContainerMain>
      </Row>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        title="Add new address"
      >
        <AddAddressForm form={form} onSubmit={onSubmit} />
      </Modal>
    </>
  );
};

export default PlaceOrder;
