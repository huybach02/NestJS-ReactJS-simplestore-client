import {reloadWishlist} from "@/redux/slice/dataSlice";
import {baseService} from "@/service/baseService";
import {ProductType} from "@/types/productType";
import {checkHasSale, checkProductHasVariantSale} from "@/utils/checkHasSale";
import {handleShowPrice} from "@/utils/handleShowPrice";
import {limitText} from "@/utils/limitText";
import {Badge, Button, Card, Flex, Grid, Image, Typography} from "antd";
import Link from "next/link";
import {useRouter} from "next/router";
import React from "react";
import {FiHeart, FiTrash2} from "react-icons/fi";
import {IoStar} from "react-icons/io5";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/redux/store";

const {Text} = Typography;

const ProductCard = ({
  product,
  isInWishlist = false,
}: {
  product: ProductType;
  isInWishlist?: boolean;
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const {lg} = Grid.useBreakpoint();

  const router = useRouter();

  const {originalPrice, salePrice, minPrice, maxPrice} =
    handleShowPrice(product);

  const handleAddToWishlist = async (productId: string) => {
    await baseService.addToWishlist(productId);
    dispatch(reloadWishlist());
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    await baseService.removeFromWishlist(productId);
    dispatch(reloadWishlist());
  };

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
        <Card hoverable style={{height: lg ? 440 : 390, position: "relative"}}>
          <div style={{width: "100%"}}>
            <Link
              href={`/product/${product.slug}`}
              style={{width: "100%", display: "flex", justifyContent: "center"}}
            >
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
                <Flex wrap gap={5}>
                  <Flex align="center" gap={5}>
                    <Text
                      style={{
                        fontSize: lg ? 16 : 12,
                        fontWeight: 400,
                        display: !lg ? "block" : "none",
                      }}
                    >
                      From
                    </Text>
                    <Text style={{fontSize: lg ? 16 : 14}}>{minPrice}</Text>
                  </Flex>
                  <Flex align="center" gap={5}>
                    {maxPrice && (
                      <>
                        <Text style={{fontSize: lg ? 16 : 12, fontWeight: 400}}>
                          {lg ? "-" : "To"}
                        </Text>
                        <Text style={{fontSize: lg ? 16 : 14}}>{maxPrice}</Text>
                      </>
                    )}
                  </Flex>
                </Flex>
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
              display: lg ? "flex" : "none",
            }}
            gap={10}
          >
            <Button
              size={lg ? "middle" : "small"}
              type="default"
              style={{
                fontSize: lg ? 16 : 14,
                padding: "10px 20px",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
              }}
              onClick={() => router.push(`/product/${product.slug}`)}
            >
              View Details
            </Button>
            {!isInWishlist ? (
              <Button
                type="default"
                shape="circle"
                icon={<FiHeart />}
                onClick={() => handleAddToWishlist(product._id)}
              />
            ) : (
              <Button
                type="default"
                danger
                shape="circle"
                icon={<FiTrash2 />}
                onClick={() => handleRemoveFromWishlist(product._id)}
              />
            )}
          </Flex>
        </Card>
      </Badge.Ribbon>
    </>
  );
};

export default ProductCard;
