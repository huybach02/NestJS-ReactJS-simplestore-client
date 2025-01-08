/* eslint-disable @typescript-eslint/no-explicit-any */
import {RootState} from "@/redux/store";
import {orderService} from "@/service/orderService";
import {formatMoney} from "@/utils/formatMoney";
import {Badge, Button, Drawer, Flex, Table, Tag, Tooltip} from "antd";
import React, {useEffect, useState} from "react";
import {FiEye} from "react-icons/fi";
import {useSelector} from "react-redux";
import OrderDetail from "./OrderDetail";

const CustomerOrder = () => {
  const {user} = useSelector((state: RootState) => state.user);

  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState();
  const [showModal, setShowModal] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await orderService.getCustomerOrder();
    if (res?.success) {
      setOrders(res.data);
    }
    setLoading(false);
  };

  const columns = [
    {title: "InvoiceId", dataIndex: "invoiceId", key: "invoiceId"},
    {
      title: "Products Quantity",
      dataIndex: "products",
      key: "products",
      render: (_value: string, record: any) => (
        <p style={{textAlign: "center"}}>{record.products.length}</p>
      ),
    },
    {
      title: "Sub Total",
      dataIndex: "subTotal",
      key: "subTotal",
      render: (_value: string, record: any) => formatMoney(record.subTotal),
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      render: (_value: string, record: any) =>
        "- " + formatMoney(record.discount),
    },
    {
      title: "Total",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (_value: string, record: any) => formatMoney(record.totalAmount),
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (paymentMethod: string) => (
        <span style={{textTransform: "uppercase"}}>
          <Badge color="#000" count={paymentMethod}></Badge>
        </span>
      ),
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (paymentStatus: string) => (
        <span>
          {paymentStatus === "success" ? (
            <Tag color="green">Paid</Tag>
          ) : paymentStatus === "pending" ? (
            <Tag color="orange">Pending</Tag>
          ) : (
            <Tag color="red">Failed</Tag>
          )}
        </span>
      ),
    },
    {
      title: "Order Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (orderStatus: string) => (
        <span>
          {orderStatus === "confirmed" ? (
            <Tag color="blue">Confirmed</Tag>
          ) : orderStatus === "processing" ? (
            <Tag color="orange">Processing</Tag>
          ) : orderStatus === "shipping" ? (
            <Tag color="cyan">Shipping</Tag>
          ) : orderStatus === "completed" ? (
            <Tag color="green">Completed</Tag>
          ) : (
            <Tag color="red">Cancelled</Tag>
          )}
        </span>
      ),
    },
    {
      title: "Action",
      dataIndex: "",
      key: "action",
      fixed: "right" as const,
      render: (record: any) => (
        <Flex gap={10}>
          <Tooltip title="View Order Detail">
            <Button
              size="small"
              type="primary"
              onClick={() => {
                setShowModal(true);
                setSelectedOrder(record);
              }}
            >
              <FiEye size={14} />
            </Button>
          </Tooltip>
        </Flex>
      ),
    },
  ];

  useEffect(() => {
    fetchOrders();
  }, [user]);

  return (
    <>
      <Table
        dataSource={orders}
        columns={columns}
        loading={loading}
        scroll={{
          x: "max-content",
        }}
      />
      <Drawer
        placement="bottom"
        height={"100%"}
        title="Order Detail"
        open={showModal}
        onClose={() => setShowModal(false)}
        footer={false}
        width={1500}
      >
        <OrderDetail
          order={selectedOrder}
          setShowModal={setShowModal}
          fetchOrders={fetchOrders}
        />
      </Drawer>
    </>
  );
};

export default CustomerOrder;
