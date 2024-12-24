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
import {useRouter} from "next/router";
import {useDispatch} from "react-redux";
import {setUser} from "@/redux/slice/userSlice";
import {authService} from "../../service/authService";
import CheckAuthenticated from "@/components/CheckAuthenticated";

const Verified = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const {lg} = Grid.useBreakpoint();

  const [isLoading, setIsLoading] = useState(false);

  const [form] = Form.useForm();

  const handleSubmit = async (values: {otp: string}) => {
    try {
      setIsLoading(true);
      const response = await authService.verifyOtp({
        email: router.query.email as string,
        otp: values.otp,
      });
      if (response?.success) {
        dispatch(setUser(response?.data));
        router.push("/");
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
              Verify OTP
            </Typography.Title>
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
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{width: "100%", padding: "20px 0", marginTop: 5}}
                  loading={isLoading}
                >
                  Verify my account
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Flex>
      </Col>
    </Row>
  );
};

export default CheckAuthenticated(Verified);
