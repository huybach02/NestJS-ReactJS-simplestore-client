/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Avatar,
  Badge,
  Button,
  Col,
  Divider,
  Flex,
  Grid,
  Row,
  Table,
  Tag,
  Typography,
} from "antd";
import dayjs from "dayjs";
import {ProductType} from "../types/productType";
import {formatMoney} from "../utils/formatMoney";
import Link from "next/link";
import {StepOfOrder} from "./StepOfOrder";
import {orderService} from "@/service/orderService";

const OrderDetail = ({
  order,
  setShowModal,
  fetchOrders,
}: {
  order: any;
  setShowModal: any;
  fetchOrders: any;
}) => {
  const {lg} = Grid.useBreakpoint();

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      width: 50,
      render: (_value: string, _record: any, index: number) => {
        return <Typography.Text>{index + 1}</Typography.Text>;
      },
    },
    {
      title: "Thumbnail",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (_value: string, record: any) => {
        return (
          <Avatar src={record.product.thumbnail} shape="square" size={40} />
        );
      },
      width: 50,
    },
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      render: (product: ProductType, record: any) => {
        return (
          <Flex vertical>
            <Link href={`/product/${product.slug}`} target="_blank">
              <Typography.Text style={{fontSize: "16px", fontWeight: "bold"}}>
                {product.name}
              </Typography.Text>
            </Link>
            <Typography.Text style={{fontSize: "14px"}}>
              Sku: {product.sku}
            </Typography.Text>
            <Flex gap={15} style={{marginBottom: 0}}>
              {!record.hasVariant && (
                <>
                  {product.salePrice && (
                    <Typography.Text
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "red",
                      }}
                    >
                      {formatMoney(product.salePrice)}
                    </Typography.Text>
                  )}
                  <Typography.Text
                    style={{
                      textDecoration: product.salePrice ? "line-through" : "",
                      fontSize: 14,
                      fontWeight: 500,
                    }}
                  >
                    {formatMoney(product.originalPrice)}
                  </Typography.Text>
                </>
              )}
              {record.hasVariant && (
                <>
                  {record.variant?.salePrice && (
                    <Typography.Text
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "red",
                      }}
                    >
                      {formatMoney(record.variant?.salePrice)}
                    </Typography.Text>
                  )}
                  <Typography.Text
                    style={{
                      textDecoration: record.variant?.salePrice
                        ? "line-through"
                        : "",
                      fontSize: 14,
                      fontWeight: 500,
                    }}
                  >
                    {formatMoney(record.variant?.originalPrice)}
                  </Typography.Text>
                </>
              )}
            </Flex>
            {record.hasVariant && (
              <Flex gap={10}>
                <Typography.Text style={{fontSize: 14}}>
                  <b>Version:</b> {record.variant?.name}
                </Typography.Text>
                {record.size && (
                  <Typography.Text style={{fontSize: 14}}>
                    <b>Size:</b> {record.size}
                  </Typography.Text>
                )}
              </Flex>
            )}
          </Flex>
        );
      },
    },
    {
      title: "Quantity",
      dataIndex: "buyQuantity",
      key: "quantity",
      render: (quantity: number) => (
        <Typography.Text>{quantity}</Typography.Text>
      ),
    },
    {
      title: "Into Money",
      dataIndex: "intoMoney",
      key: "intoMoney",
      render: (_intoMoney: number, record: any) => (
        <Typography.Text>
          {formatMoney(
            record.hasVariant
              ? record.variant?.hasSale
                ? record.variant?.salePrice * record.buyQuantity
                : record.variant?.originalPrice * record.buyQuantity
              : record.product.hasSale
              ? record.product.salePrice * record.buyQuantity
              : record.product.originalPrice * record.buyQuantity
          )}
        </Typography.Text>
      ),
    },
    {
      title: "Taking Return",
      dataIndex: "product",
      key: "takingReturn",
      render: (product: ProductType) => (
        <Typography.Text>{product.takingReturn ? "Yes" : "No"}</Typography.Text>
      ),
    },
  ];

  const handleCancelOrder = async () => {
    await orderService.cancelOrder(order._id);
    fetchOrders();
    setShowModal(false);
  };

  return (
    <div style={{padding: lg ? "0 40px" : "0 10px"}}>
      {order.orderStatus === "confirmed" && (
        <Flex justify="flex-end">
          <Button
            size="large"
            type="primary"
            danger
            onClick={handleCancelOrder}
          >
            Cancel Order
          </Button>
        </Flex>
      )}
      <Flex vertical gap={20} style={{marginTop: "20px"}}>
        <Flex justify="space-between" wrap>
          <Flex align="center" gap={10}>
            <Typography.Text style={{fontSize: "20px"}}>
              <b>Order ID: </b>
            </Typography.Text>
            <Typography.Text style={{fontSize: "20px"}}>
              {order?.invoiceId}
            </Typography.Text>
          </Flex>
          <Flex align="center" gap={10}>
            <Typography.Text style={{fontSize: "20px"}}>
              <b>Created At: </b>
            </Typography.Text>
            <Typography.Text style={{fontSize: "20px"}}>
              {dayjs(order?.createdAt).format("DD/MM/YYYY HH:mm:ss")}
            </Typography.Text>
          </Flex>
        </Flex>

        <StepOfOrder order={order} />

        <Row gutter={[16, 16]}>
          <Col span={lg ? 6 : 24}>
            <Flex vertical gap={10}>
              <Typography.Text style={{fontSize: "20px"}}>
                <b>Customer Info: </b>
              </Typography.Text>
              <Flex align="center" gap={10}>
                <Avatar
                  src={
                    order?.userId?.avatar ||
                    "https://static-00.iconduck.com/assets.00/profile-circle-icon-256x256-cm91gqm2.png"
                  }
                  alt="avatar"
                  size={30}
                />
                <Typography.Text>{order?.userId?.name}</Typography.Text>
              </Flex>
              <Flex align="center" gap={10}>
                <Typography.Text>
                  <b>Email: </b>
                </Typography.Text>
                <Typography.Text>{order?.userId?.email}</Typography.Text>
              </Flex>
              <Flex align="center" gap={10}>
                <Typography.Text>
                  <b>Phone: </b>
                </Typography.Text>
                <Typography.Text>{order?.userId?.phone}</Typography.Text>
              </Flex>
            </Flex>
          </Col>
          <Col span={lg ? 6 : 24}>
            <Flex vertical gap={10}>
              <Typography.Text style={{fontSize: "20px"}}>
                <b>Shipping Info: </b>
              </Typography.Text>
              <Flex align="center" gap={10}>
                <Typography.Text>
                  <b>Receiver Name: </b>
                </Typography.Text>
                <Typography.Text>{order?.address?.receiver}</Typography.Text>
              </Flex>
              <Flex align="center" gap={10}>
                <Typography.Text>
                  <b>Phone: </b>
                </Typography.Text>
                <Typography.Text>{order?.address?.phone}</Typography.Text>
              </Flex>
              <Flex align="center" gap={10}>
                <Typography.Text>
                  <b>Province: </b>
                </Typography.Text>
                <Typography.Text>{order?.address?.province}</Typography.Text>
              </Flex>
              <Flex align="center" gap={10}>
                <Typography.Text>
                  <b>District: </b>
                </Typography.Text>
                <Typography.Text>{order?.address?.district}</Typography.Text>
              </Flex>
              <Flex align="center" gap={10}>
                <Typography.Text>
                  <b>Ward: </b>
                </Typography.Text>
                <Typography.Text>{order?.address?.ward}</Typography.Text>
              </Flex>
              <Flex align="center" gap={10}>
                <Typography.Text>
                  <b>Address: </b>
                </Typography.Text>
                <Typography.Text>{order?.address?.address}</Typography.Text>
              </Flex>
              <Flex align="center" gap={10}>
                <Typography.Text>
                  <b>Note: </b>
                </Typography.Text>
                <Typography.Text>
                  {order?.address?.note || "-----"}
                </Typography.Text>
              </Flex>
            </Flex>
          </Col>
          <Col span={lg ? 6 : 24}>
            <Flex vertical gap={10}>
              <Typography.Text style={{fontSize: "20px"}}>
                <b>Payment Info: </b>
              </Typography.Text>
              <Flex align="center" gap={10}>
                <Typography.Text>
                  <b>Payment Method: </b>
                </Typography.Text>
                <span style={{textTransform: "uppercase"}}>
                  <Badge color="#000" count={order?.paymentMethod}></Badge>
                </span>
              </Flex>
              <Flex align="center" gap={10}>
                <Typography.Text>
                  <b>Payment Status: </b>
                </Typography.Text>
                <span>
                  {order?.paymentStatus === "success" ? (
                    <Tag color="green">Paid</Tag>
                  ) : order?.paymentStatus === "pending" ? (
                    <Tag color="orange">Pending</Tag>
                  ) : (
                    <Tag color="red">Failed</Tag>
                  )}
                </span>
              </Flex>
              <Flex align="center" gap={10}>
                <Typography.Text>
                  <b>Order Status: </b>
                </Typography.Text>
                <span>
                  {order?.orderStatus === "confirmed" ? (
                    <Tag color="blue">Confirmed</Tag>
                  ) : order?.orderStatus === "processing" ? (
                    <Tag color="orange">Processing</Tag>
                  ) : order?.orderStatus === "shipping" ? (
                    <Tag color="cyan">Shipping</Tag>
                  ) : order?.orderStatus === "completed" ? (
                    <Tag color="green">Completed</Tag>
                  ) : (
                    <Tag color="red">Cancelled</Tag>
                  )}
                </span>
              </Flex>
            </Flex>
          </Col>
          <Col span={lg ? 6 : 24}>
            <Flex vertical gap={10}>
              <Typography.Text style={{fontSize: "20px"}}>
                <b>Voucher Applied: </b>
              </Typography.Text>
              {order?.voucher ? (
                <Flex vertical gap={10}>
                  <Flex align="center" gap={10}>
                    <Typography.Text>
                      <b>Voucher Name: </b>
                    </Typography.Text>
                    <Typography.Text>
                      {order?.voucher
                        ? order?.voucher?.title
                        : "No voucher applied"}
                    </Typography.Text>
                  </Flex>
                  <Flex align="center" gap={10}>
                    <Typography.Text>
                      <b>Voucher Code: </b>
                    </Typography.Text>
                    <Typography.Text>
                      {order?.voucher
                        ? order?.voucher?.code
                        : "No voucher applied"}
                    </Typography.Text>
                  </Flex>
                  <Flex align="center" gap={10}>
                    <Typography.Text>
                      <b>Value Discount: </b>
                    </Typography.Text>
                    <Typography.Text>
                      {order?.voucher
                        ? `${
                            order?.voucher?.typeDiscount === "percentage"
                              ? order?.voucher?.valueDiscount + "%"
                              : formatMoney(
                                  Number(order?.voucher?.valueDiscount)
                                )
                          }`
                        : "No voucher applied"}
                    </Typography.Text>
                  </Flex>
                  <Flex align="center" gap={10}>
                    <Typography.Text>
                      <b>Min Amount Of Order: </b>
                    </Typography.Text>
                    <Typography.Text>
                      {order?.voucher
                        ? formatMoney(Number(order?.voucher?.minAmountOfOrder))
                        : "No voucher applied"}
                    </Typography.Text>
                  </Flex>
                  <Flex align="center" gap={10}>
                    <Typography.Text>
                      <b>Max Discount: </b>
                    </Typography.Text>
                    <Typography.Text>
                      {order?.voucher
                        ? formatMoney(Number(order?.voucher?.maxDiscount))
                        : "No voucher applied"}
                    </Typography.Text>
                  </Flex>
                </Flex>
              ) : (
                <Typography.Text>No voucher applied</Typography.Text>
              )}
            </Flex>
          </Col>
        </Row>

        <Divider />

        <Flex vertical gap={10}>
          <Typography.Text style={{fontSize: "20px"}}>
            <b>Products: </b>
          </Typography.Text>

          <Table
            columns={columns}
            dataSource={order?.products}
            pagination={false}
            rowKey="_id"
            scroll={{
              x: "max-content",
            }}
          />
        </Flex>

        <Divider />

        <Flex vertical align="flex-end" gap={10}>
          <Flex gap={10}>
            <Typography.Text style={{fontSize: "20px"}}>
              <b>Sub Total: </b>
            </Typography.Text>
            <Typography.Text style={{fontSize: "20px"}}>
              {formatMoney(order?.subTotal || 0)}
            </Typography.Text>
          </Flex>
          <Flex gap={10}>
            <Typography.Text style={{fontSize: "20px"}}>
              <b>Discount: </b>
            </Typography.Text>
            <Typography.Text style={{fontSize: "20px"}}>
              - {formatMoney(order?.discount || 0)}
            </Typography.Text>
          </Flex>
          <Divider style={{margin: "10px 0"}} />
          <Flex gap={10}>
            <Typography.Text style={{fontSize: "24px"}}>
              <b>Total Amount: </b>
            </Typography.Text>
            <Typography.Text style={{fontSize: "24px"}}>
              {formatMoney(order?.totalAmount || 0)}
            </Typography.Text>
          </Flex>
        </Flex>
      </Flex>
    </div>
  );
};

export default OrderDetail;
