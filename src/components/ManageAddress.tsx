import {orderService} from "@/service/orderService";
import {AddressType} from "@/types/addressType";
import {Button, Flex, Form, List, Modal, Typography} from "antd";
import React, {useEffect, useState} from "react";
import {
  LuMapPin,
  LuNotebook,
  LuPhone,
  LuPlus,
  LuTrash,
  LuUser,
} from "react-icons/lu";
import AddAddressForm from "./AddAddressForm";

const ManageAddress = () => {
  const [address, setAddress] = useState<AddressType[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

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

  useEffect(() => {
    fetchAddress();
  }, []);

  return (
    <>
      <Flex vertical gap={20}>
        <Flex justify="end">
          <Button
            type="primary"
            icon={<LuPlus />}
            size="large"
            onClick={() => setOpen(true)}
          >
            Add Address
          </Button>
        </Flex>
        <List
          itemLayout="horizontal"
          dataSource={address}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <Typography.Title level={4}>
                    <b>
                      <LuUser /> Receiver:{" "}
                    </b>
                    <span>{item.receiver}</span>
                  </Typography.Title>
                }
                description={
                  <Flex justify="space-between">
                    <Flex vertical gap={10}>
                      <Typography.Text>
                        <b>
                          <LuPhone /> Phone:{" "}
                        </b>
                        <span>{item.phone}</span>
                      </Typography.Text>
                      <Typography.Text>
                        <b>
                          <LuMapPin /> Province/City:{" "}
                        </b>
                        <span>{item.province}</span>
                      </Typography.Text>
                      <Typography.Text>
                        <b>
                          <LuMapPin /> District:{" "}
                        </b>
                        <span>{item.district}</span>
                      </Typography.Text>
                      <Typography.Text>
                        <b>
                          <LuMapPin /> Ward:{" "}
                        </b>
                        <span>{item.ward}</span>
                      </Typography.Text>
                      <Typography.Text>
                        <b>
                          <LuMapPin /> Address:{" "}
                        </b>
                        <span>{item.address}</span>
                      </Typography.Text>

                      <Typography.Text>
                        <b>
                          <LuNotebook /> Note:{" "}
                        </b>
                        <span>{item.note}</span>
                      </Typography.Text>
                    </Flex>
                    <Flex>
                      <Button
                        type="default"
                        danger
                        icon={<LuTrash />}
                        onClick={async () => {
                          await orderService.deleteAddress(item._id!);
                          fetchAddress();
                        }}
                      ></Button>
                    </Flex>
                  </Flex>
                }
              />
            </List.Item>
          )}
        />
      </Flex>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        title="Add new address"
        loading={loading}
      >
        <AddAddressForm form={form} onSubmit={onSubmit} />
      </Modal>
    </>
  );
};

export default ManageAddress;
