import {RootState} from "@/redux/store";
import {Col, Empty, Row} from "antd";
import React from "react";
import {useSelector} from "react-redux";
import ProductCard from "./ProductCard";

const Wishlist = () => {
  const {wishlist} = useSelector((state: RootState) => state.data);

  return (
    <>
      <Row gutter={[16, 16]}>
        {wishlist &&
          wishlist.length > 0 &&
          wishlist.map((product) => (
            <Col span={6} key={product.id}>
              <ProductCard product={product.productId} isInWishlist={true} />
            </Col>
          ))}
        {wishlist && wishlist.length === 0 && (
          <Col span={24}>
            <Empty description="No wishlist items found" />
          </Col>
        )}
      </Row>
    </>
  );
};

export default Wishlist;
