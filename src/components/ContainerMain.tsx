import {Col, Grid} from "antd";
import React from "react";

const ContainerMain = ({children}: {children: React.ReactNode}) => {
  const {lg} = Grid.useBreakpoint();

  return (
    <>
      <Col span={lg ? 2 : 1}></Col>
      <Col span={lg ? 20 : 22}>{children}</Col>
      <Col span={lg ? 2 : 0}></Col>
    </>
  );
};

export default ContainerMain;
