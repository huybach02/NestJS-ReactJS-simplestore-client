import {ProductType} from "@/types/productType";
import {checkHasSale, checkProductHasVariantSale} from "@/utils/checkHasSale";
import {handleShowPrice} from "@/utils/handleShowPrice";
import {limitText} from "@/utils/limitText";
import {Badge, Button, Card, Flex, Grid, Image, Typography} from "antd";
import Link from "next/link";
import React from "react";
import {BsCartPlus} from "react-icons/bs";
import {FiHeart} from "react-icons/fi";
import {IoStar} from "react-icons/io5";
import {MdOutlineRemoveRedEye} from "react-icons/md";

const {Text} = Typography;

const ProductCard = ({product}: {product: ProductType}) => {
  const {lg} = Grid.useBreakpoint();

  const {originalPrice, salePrice, minPrice, maxPrice} =
    handleShowPrice(product);

  return (
    <>
      <Badge.Ribbon
        text="Sale"
        color="red"
        style={{
          display:
            (product.hasSale && checkHasSale(product)) ||
            checkProductHasVariantSale(product)
              ? "block"
              : "none",
        }}
      >
        <Card hoverable style={{height: lg ? 440 : 420, position: "relative"}}>
          <div style={{width: "100%"}}>
            <Link href={`/product/${product.slug}`}>
              <Image
                src={product.thumbnail || ""}
                alt={product.name}
                preview={false}
                style={{
                  height: lg ? 200 : 180,
                  width: lg ? "210px" : "130px",
                  objectFit: "cover",
                  borderRadius: 10,
                }}
              />
            </Link>
            <div className="">
              <div className="product-actions">
                <Button type="default" shape="circle" icon={<FiHeart />} />
                <Link href={`/product/${product.slug}`}>
                  <Button
                    type="default"
                    shape="circle"
                    icon={<MdOutlineRemoveRedEye />}
                  />
                </Link>
              </div>
            </div>
          </div>

          <div style={{marginTop: 15}}>
            <div style={{fontSize: 14, fontWeight: 700}}>
              {product.supplier.name}
            </div>

            <Link
              href={`/product/${product.slug}`}
              style={{
                fontSize: 16,
                fontWeight: 600,
                marginTop: 6,
                color: "#000",
              }}
            >
              {limitText(product.name, lg ? 40 : 20)}
            </Link>

            <div>
              <Flex
                align="center"
                justify="space-between"
                gap={5}
                style={{marginTop: 5}}
              >
                <div>
                  {Array.from({length: 5}).map((_, index) => (
                    <IoStar key={index} color="#ff8f00" />
                  ))}
                </div>
              </Flex>
            </div>

            <Flex
              align="center"
              gap={10}
              style={{marginTop: 5, fontWeight: 600}}
              wrap
            >
              {!product.hasVariant && (
                <>
                  {product.hasSale && checkHasSale(product) ? (
                    <Text
                      style={{
                        fontSize: lg ? 16 : 14,
                        fontWeight: 600,
                        padding: "4px 8px",
                        backgroundColor: "#ff7373",
                        borderRadius: 4,
                        color: "#fff",
                      }}
                    >
                      {salePrice}
                    </Text>
                  ) : null}
                  <Text
                    style={{
                      textDecoration:
                        product.hasSale && checkHasSale(product)
                          ? "line-through"
                          : "none",
                      fontSize: lg ? 16 : 14,
                    }}
                  >
                    {originalPrice}
                  </Text>
                </>
              )}
              {product.hasVariant && product.variants.length === 1 && (
                <>
                  {product.variants[0].hasSale &&
                  checkHasSale(product.variants[0]) ? (
                    <Text
                      style={{
                        fontSize: lg ? 16 : 14,
                        fontWeight: 600,
                        padding: "4px 8px",
                        backgroundColor: "#ff7373",
                        borderRadius: 4,
                        color: "#fff",
                      }}
                    >
                      {salePrice}
                    </Text>
                  ) : null}
                  <Text
                    style={{
                      textDecoration:
                        product.variants[0].hasSale &&
                        checkHasSale(product.variants[0])
                          ? "line-through"
                          : "none",
                      fontSize: lg ? 16 : 14,
                    }}
                  >
                    {originalPrice}
                  </Text>
                </>
              )}
              {product.hasVariant && product.variants.length > 1 && (
                <>
                  <Text style={{fontSize: lg ? 16 : 14}}>{minPrice}</Text>
                  {maxPrice && (
                    <>
                      <Text>-</Text>
                      <Text style={{fontSize: lg ? 16 : 14}}>{maxPrice}</Text>
                    </>
                  )}
                </>
              )}
            </Flex>
          </div>
          <Flex
            justify="center"
            style={{
              marginTop: 20,
              position: "absolute",
              bottom: 20,
              left: 0,
              right: 0,
            }}
          >
            <Button
              size={lg ? "middle" : "small"}
              type="default"
              style={{
                fontSize: lg ? 16 : 14,
                padding: lg ? "10px 20px" : "14px 20px",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
              }}
              icon={<BsCartPlus />}
            >
              Add to Cart
            </Button>
          </Flex>
        </Card>
      </Badge.Ribbon>
    </>
  );
};

export default ProductCard;
