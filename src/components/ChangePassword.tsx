import {authService} from "@/service/authService";
import {Button, Card, Form, Input} from "antd";
import React, {useState} from "react";

const ChangePassword = () => {
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  const handleSubmit = async (values: {
    oldPassword: string;
    newPassword: string;
  }) => {
    setLoading(true);
    const response = await authService.changePassword({
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    });

    if (response?.success) {
      form.resetFields();
    }

    setLoading(false);
  };

  return (
    <>
      <Card>
        <Form
          layout="vertical"
          size="large"
          form={form}
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Old Password"
            name="oldPassword"
            rules={[
              {required: true, message: "Please enter your old password"},
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              {required: true, message: "Please enter your new password"},
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            rules={[
              {required: true, message: "Please enter your confirm password"},
              ({getFieldValue}) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The two passwords do not match")
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{marginTop: 20}}
            loading={loading}
          >
            Change Password
          </Button>
        </Form>
      </Card>
    </>
  );
};

export default ChangePassword;
