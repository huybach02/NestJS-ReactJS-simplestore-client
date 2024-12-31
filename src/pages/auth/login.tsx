import React, {useState} from "react";
import {
  Button,
  Card,
  Checkbox,
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
import {LoginType} from "@/types/authType";
import CheckAuthenticated from "@/components/CheckAuthenticated";
import SocialLogin from "@/components/SocialLogin";

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const {lg} = Grid.useBreakpoint();

  const [isLoading, setIsLoading] = useState(false);
  const [isRemember, setIsRemember] = useState(false);

  const [form] = Form.useForm();

  const handleSubmit = async (values: LoginType) => {
    try {
      setIsLoading(true);
      const response = await authService.login({
        ...values,
        remember: isRemember,
      });
      if (response?.success) {
        if (router.query.product) {
          router.back();
        } else {
          router.push("/");
        }
        dispatch(setUser(response?.data));
      } else {
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
            src={process.env.NEXT_PUBLIC_APP_IMAGE_LOGIN_PAGE}
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
              Login
            </Typography.Title>
            <Form
              form={form}
              onFinish={handleSubmit}
              layout="vertical"
              size="large"
              disabled={isLoading}
            >
              <Form.Item label="Email" name="email" rules={[{required: true}]}>
                <Input placeholder="example@gmail.com" />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[{required: true}]}
              >
                <Input.Password placeholder="********" />
              </Form.Item>
              <Form.Item name="remember" valuePropName="checked">
                <Checkbox
                  checked={isRemember}
                  onChange={(e) => setIsRemember(e.target.checked)}
                >
                  Remember me for 30 days
                </Checkbox>
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{width: "100%", padding: "20px 0", marginTop: 5}}
                  loading={isLoading}
                >
                  Login
                </Button>
              </Form.Item>
              <SocialLogin />
              <Flex
                vertical
                gap={10}
                style={{textAlign: "center", marginTop: 20}}
              >
                <Button
                  type="link"
                  size="small"
                  onClick={() => router.push("/auth/forgot-password")}
                >
                  Forgot password?
                </Button>
                <Typography.Text>
                  Don&apos;t have an account?{" "}
                  <Link href="/auth/register">Register</Link>
                </Typography.Text>
              </Flex>
            </Form>
          </Card>
        </Flex>
      </Col>
    </Row>
  );
};

export default CheckAuthenticated(Login);
