import {Col, Grid, Image, Row} from "antd";
import React from "react";

const DualBanner = () => {
  const {lg} = Grid.useBreakpoint();

  return (
    <>
      <Row gutter={[16, 20]}>
        <Col span={lg ? 12 : 24}>
          <Image
            src="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/db5d9720002433.562e3e20a276b.jpg"
            alt="banner"
            style={{
              width: "100%",
              objectFit: "contain",
              borderRadius: "10px",
            }}
            preview={false}
          />
        </Col>
        <Col span={lg ? 12 : 24}>
          <Image
            src="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/db5d9720002433.562e3e20a276b.jpg"
            alt="banner"
            style={{
              width: "100%",
              objectFit: "contain",
              borderRadius: "10px",
            }}
            preview={false}
          />
        </Col>
      </Row>
    </>
  );
};

export default DualBanner;
