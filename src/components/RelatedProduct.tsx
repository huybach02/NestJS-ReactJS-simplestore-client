import React, {useEffect, useState} from "react";
import {baseService} from "../service/baseService";
import {ProductType} from "@/types/productType";
import ProductCard from "./ProductCard";
import {Col, Row, Typography, Grid} from "antd";

const RelatedProduct = ({
  categoryId,
  productId,
}: {
  categoryId: string;
  productId: string;
}) => {
  const {lg} = Grid.useBreakpoint();

  const [relatedProduct, setRelatedProduct] = useState<ProductType[]>([]);

  useEffect(() => {
    const fetchRelatedProduct = async () => {
      const response = await baseService.getRelatedProduct(categoryId);
      setRelatedProduct(
        response.data.filter(
          (product: ProductType) => product._id !== productId
        )
      );
    };
    fetchRelatedProduct();
  }, [categoryId]);

  return (
    <>
      {relatedProduct?.length > 0 && (
        <div style={{width: "100%", marginTop: 10}}>
          <Typography.Title level={4} style={{marginBottom: 20}}>
            Related Products
          </Typography.Title>
          <div>
            {relatedProduct?.length > 0 && (
              <Row gutter={[16, 16]}>
                {relatedProduct.map((product, index) => (
                  <Col span={lg ? 4 : 12} key={index}>
                    <ProductCard product={product} />
                  </Col>
                ))}
              </Row>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default RelatedProduct;
