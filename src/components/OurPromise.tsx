import {Card, Col, Flex, Grid, Row, Typography} from "antd";
import React from "react";
import {FaCheckCircle} from "react-icons/fa";

interface OurPromiseProps {
  promise: {
    id: number;
    title: string;
    description: string;
    icon: string;
  }[];
}

const OurPromise = ({promise}: OurPromiseProps) => {
  const {lg} = Grid.useBreakpoint();

  return (
    <Row gutter={[16, 20]}>
      {promise.map((item) => (
        <Col span={lg ? 6 : 24} key={item.id}>
          <Card
            style={{
              boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
              height: "250px",
              paddingTop: 20,
            }}
          >
            <Flex vertical align="center" gap={10}>
              <FaCheckCircle size={40} />
              <Typography.Title level={5} style={{marginTop: 20}}>
                {item.title}
              </Typography.Title>
              <Typography.Text style={{fontSize: 14, textAlign: "center"}}>
                {item.description}
              </Typography.Text>
            </Flex>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default OurPromise;
