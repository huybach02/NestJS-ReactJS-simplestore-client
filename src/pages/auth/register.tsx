import React, {useState} from "react";
import {
  Button,
  Card,
  Col,
  Flex,
  Form,
  Image,
  Input,
  Row,
  Typography,
} from "antd";
import {Grid} from "antd";
import Link from "next/link";
import {RegisterType} from "@/types/authType";
import {authService} from "@/service/authService";
import {useRouter} from "next/router";
import CheckAuthenticated from "@/components/CheckAuthenticated";

const Register = () => {
  const router = useRouter();

  const {lg} = Grid.useBreakpoint();

  const [form] = Form.useForm();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: RegisterType) => {
    try {
      setIsLoading(true);
      const response = await authService.register(values);
      if (response?.success) {
        router.push("/auth/verified?email=" + response?.data?.email);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Row
      align="middle"
      style={
        {
          // minHeight: "100vh",
          // padding: md ? 0 : "50px 0 50px 0",
          // overflow: "hidden",
        }
      }
    >
      <Col
        md={{span: 12}}
        style={{height: "100vh", display: lg ? "block" : "none"}}
      >
        <Flex
          align="center"
          justify="center"
          style={{
            height: "100%",
            flexDirection: "column",
          }}
        >
          <Image
            alt=""
            width={"100%"}
            height={"100%"}
            style={{
              objectFit: "cover",
            }}
            src={process.env.NEXT_PUBLIC_APP_IMAGE_REGISTER_PAGE}
            preview={false}
          />
        </Flex>
      </Col>
      <Col
        xs={{
          span: 24,
        }}
        md={{
          span: 12,
        }}
        style={{
          height: "100vh",
        }}
      >
        <Flex
          justify="center"
          align="center"
          vertical
          style={{
            height: "100%",
            gap: "24px",
          }}
        >
          <Link href="/">
            <Image
              alt=""
              width={200}
              src={process.env.NEXT_PUBLIC_APP_LOGO_URL}
              preview={false}
              style={{
                marginBottom: 0,
              }}
            />
          </Link>
          <Card
            title=""
            style={{
              width: lg ? "60%" : "95%",
              margin: 0,
            }}
          >
            <Typography.Title
              level={3}
              style={{textAlign: "center", marginBottom: 24}}
            >
              Register
            </Typography.Title>
            <Form
              layout="vertical"
              size="large"
              form={form}
              onFinish={handleSubmit}
              disabled={isLoading}
            >
              <Form.Item
                label="Full Name"
                name="name"
                rules={[{required: true}]}
              >
                <Input placeholder="example: John Doe" />
              </Form.Item>
              <Form.Item label="Email" name="email" rules={[{required: true}]}>
                <Input placeholder="example: john@gmail.com" />
              </Form.Item>
              <Form.Item label="Phone" name="phone" rules={[{required: true}]}>
                <Input placeholder="example: 0123456789" />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[{required: true}]}
              >
                <Input.Password placeholder="example: ********" />
              </Form.Item>
              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                rules={[
                  {required: true},
                  ({getFieldValue}) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("The two passwords do not match")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="example: ********" />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{width: "100%", padding: "20px 0", marginTop: 20}}
                  loading={isLoading}
                >
                  Register new account
                </Button>
              </Form.Item>
              <div style={{textAlign: "center"}}>
                <Typography.Text>
                  Already have an account? <Link href="/auth/login">Login</Link>
                </Typography.Text>
              </div>
            </Form>
          </Card>
        </Flex>
      </Col>
    </Row>
  );
};

export default CheckAuthenticated(Register);
