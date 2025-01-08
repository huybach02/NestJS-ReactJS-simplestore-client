import {Button, Card, Col, Flex, Form, Input, Row} from "antd";
import React, {useState} from "react";
import UploadSingleImage from "./UploadSingleImage";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";
import {authService} from "@/service/authService";
import {useDispatch} from "react-redux";
import {setUser} from "@/redux/slice/userSlice";

const PersonalInformation = () => {
  const dispatch = useDispatch();

  const {user} = useSelector((state: RootState) => state.user);

  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(user?.avatar);

  const handleSubmit = async (values: {name: string; phone: string}) => {
    setLoading(true);
    const response = await authService.updateProfile({
      name: values.name,
      phone: values.phone,
      avatar: photoUrl,
    });
    if (response?.success) {
      dispatch(setUser(response.data));
    }
    setLoading(false);
  };

  return (
    <div>
      <Card>
        <Flex style={{marginBottom: 20}}>
          <UploadSingleImage
            title="Profile Avatar"
            photoUrl={photoUrl || user?.avatar}
            setPhotoUrl={setPhotoUrl}
          />
        </Flex>
        <Form
          layout="vertical"
          size="large"
          form={form}
          onFinish={handleSubmit}
        >
          <Row gutter={[16, 16]}>
            <Col span={24} md={12}>
              <Form.Item
                label="Name"
                name="name"
                initialValue={user?.name}
                rules={[{required: true, message: "Please enter your name"}]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item
                label="Email"
                name="email"
                initialValue={user?.email}
                rules={[{required: true, message: "Please enter your email"}]}
              >
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item
                label="Phone"
                name="phone"
                initialValue={user?.phone}
                rules={[{required: true, message: "Please enter your phone"}]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Flex style={{marginTop: 20}}>
            <Button type="primary" htmlType="submit" loading={loading}>
              Save Changes
            </Button>
          </Flex>
        </Form>
      </Card>
    </div>
  );
};

export default PersonalInformation;
