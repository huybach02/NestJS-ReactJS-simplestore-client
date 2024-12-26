import React from "react";
import TitleMain from "./TitleMain";
import {Button, Col, Grid, Row} from "antd";
import ProductCard from "./ProductCard";
import {ProductType} from "@/types/productType";
import Link from "next/link";

const OurBestSeller = ({bestSelling}: {bestSelling: ProductType[]}) => {
  const {lg} = Grid.useBreakpoint();

  return (
    <>
      <TitleMain title="Our Best Seller" />
      <Row gutter={[16, 16]}>
        {bestSelling.map((product) => (
          <Col span={lg ? 4 : 12} key={product._id}>
            <ProductCard product={product} />
          </Col>
        ))}
        <Link href="/shop" style={{margin: "0 auto", marginTop: 20}}>
          <Button type="default" size="middle">
            Show more
          </Button>
        </Link>
      </Row>
    </>
  );
};

export default OurBestSeller;
