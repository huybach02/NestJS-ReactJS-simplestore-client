import React from "react";
import {
  Layout,
  Row,
  Col,
  Typography,
  Input,
  Button,
  Space,
  Divider,
  Grid,
  Image,
} from "antd";
import {
  FacebookOutlined,
  InstagramOutlined,
  TwitterOutlined,
  MailOutlined,
} from "@ant-design/icons";
import Link from "next/link";

const {Footer} = Layout;
const {Title, Text} = Typography;

const FooterMain = () => {
  const {lg} = Grid.useBreakpoint();

  return (
    <Footer style={{background: "#fff", padding: lg ? "40px 0" : "20px 0"}}>
      <Divider
        style={{
          background: "#000",
          margin: lg ? "0 0 32px 0" : "0 0 24px 0",
        }}
      />
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: lg ? "0 20px" : "0 15px",
        }}
      >
        <Row justify="center" style={{marginBottom: lg ? "40px" : "24px"}}>
          <Col>
            <Image
              src={process.env.NEXT_PUBLIC_APP_LOGO_URL}
              alt="Logo"
              width={lg ? 200 : 150}
              preview={false}
            />
          </Col>
        </Row>

        <Divider />

        <Row gutter={[lg ? 32 : 16, lg ? 32 : 16]}>
          <Col xs={24} sm={12} md={5}>
            <Title level={4} style={{color: "#000"}}>
              BRAND
            </Title>
            <Space direction="vertical" style={{color: "#000"}}>
              <Link href="/about-us" style={{color: "#000"}}>
                About Us
              </Link>
              <Link href="/store" style={{color: "#000"}}>
                Shop
              </Link>
              <Link href="/contact" style={{color: "#000"}}>
                Contact
              </Link>
              <Link href="/" style={{color: "#000"}}>
                Careers
              </Link>
            </Space>
          </Col>

          <Col xs={24} sm={12} md={5}>
            <Title level={4} style={{color: "#000"}}>
              SUPPORT
            </Title>
            <Space direction="vertical">
              <Link href="/" style={{color: "#000"}}>
                FAQ
              </Link>
              <Link href="/" style={{color: "#000"}}>
                Shipping
              </Link>
              <Link href="/" style={{color: "#000"}}>
                Returns
              </Link>
              <Link href="/" style={{color: "#000"}}>
                Shopping Guide
              </Link>
            </Space>
          </Col>

          <Col xs={24} sm={12} md={5}>
            <Title level={4} style={{color: "#000"}}>
              POLICIES
            </Title>
            <Space direction="vertical">
              <Link href="/" style={{color: "#000"}}>
                Terms of Service
              </Link>
              <Link href="/" style={{color: "#000"}}>
                Privacy Policy
              </Link>
              <Link href="/" style={{color: "#000"}}>
                Payment Policy
              </Link>
            </Space>
          </Col>

          <Col xs={24} sm={12} md={9}>
            <Title level={4} style={{color: "#000"}}>
              NEWSLETTER
            </Title>
            <Space direction="vertical" size="large">
              <Text style={{color: "#000"}}>
                Subscribe to receive updates about new products and special
                offers
              </Text>
              <Space>
                <Input
                  placeholder="Your email"
                  size={lg ? "large" : "small"}
                  style={{width: lg ? 250 : 150}}
                />
                <Button type="primary" size={lg ? "large" : "small"}>
                  Subscribe
                </Button>
              </Space>
            </Space>
          </Col>
        </Row>

        <Divider />

        <Row
          justify="space-between"
          align="middle"
          style={{
            flexDirection: lg ? "row" : "column",
            gap: lg ? 0 : "16px",
          }}
        >
          <Col>
            <Text
              style={{
                color: "#000",
                fontSize: lg ? 14 : 12,
                textAlign: lg ? "left" : "center",
                display: "block",
              }}
            >
              © 2024 Simple Store. All rights reserved. Made with ❤️ by Huy Bach
            </Text>
          </Col>
          <Col>
            <Space size={lg ? "large" : "middle"}>
              <FacebookOutlined
                style={{color: "#000", fontSize: lg ? 24 : 20}}
              />
              <InstagramOutlined
                style={{color: "#000", fontSize: lg ? 24 : 20}}
              />
              <TwitterOutlined
                style={{color: "#000", fontSize: lg ? 24 : 20}}
              />
              <MailOutlined style={{color: "#000", fontSize: lg ? 24 : 20}} />
            </Space>
          </Col>
        </Row>
      </div>
    </Footer>
  );
};

export default FooterMain;
