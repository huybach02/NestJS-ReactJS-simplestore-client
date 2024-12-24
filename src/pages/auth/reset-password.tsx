import React, {useEffect, useState} from "react";
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
import {useRouter} from "next/router";
import {authService} from "../../service/authService";
import CheckAuthenticated from "@/components/CheckAuthenticated";

const ResetPassword = () => {
  const router = useRouter();

  const {lg} = Grid.useBreakpoint();

  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const [form] = Form.useForm();

  const handleSubmit = async (values: {otp: string; password: string}) => {
    try {
      setIsLoading(true);
      const response = await authService.resetPassword({
        email: router.query.email as string,
        otp: values.otp,
        password: values.password,
      });
      if (response?.success) {
        router.push("/auth/login");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setIsLoading(true);
      const response = await authService.forgotPassword({
        email: router.query.email as string,
      });
      if (response?.success) {
        setCountdown(60);
        router.push("/auth/reset-password?email=" + router.query.email);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown]);

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
        xs={{span: 24}}
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
            src={process.env.NEXT_PUBLIC_APP_IMAGE_VERIFY_PAGE}
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
          <Link href="/" style={{display: "flex", justifyContent: "center"}}>
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
              Reset Password
            </Typography.Title>
            <p style={{textAlign: "center", marginBottom: 24}}>
              We have sent a verification code to <br />{" "}
              <b>{router.query.email}</b>. <br />
              Please enter the code below to reset your password.
            </p>
            <Form
              form={form}
              onFinish={handleSubmit}
              layout="vertical"
              size="large"
              disabled={isLoading}
            >
              <Form.Item label="OTP" name="otp" rules={[{required: true}]}>
                <Input.OTP />
              </Form.Item>
              <Flex justify="end">
                <Button
                  size="small"
                  type="default"
                  onClick={handleResendOTP}
                  disabled={countdown > 0 || isLoading}
                >
                  {countdown > 0
                    ? `Send OTP again in ${countdown}s`
                    : "Send OTP again"}
                </Button>
              </Flex>
              <Form.Item
                label="New Password"
                name="password"
                rules={[{required: true}]}
              >
                <Input.Password />
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
                        new Error(
                          "The two passwords that you entered do not match!"
                        )
                      );
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{width: "100%", padding: "20px 0", marginTop: 5}}
                  loading={isLoading}
                >
                  Reset Password
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Flex>
      </Col>
    </Row>
  );
};

export default CheckAuthenticated(ResetPassword);
