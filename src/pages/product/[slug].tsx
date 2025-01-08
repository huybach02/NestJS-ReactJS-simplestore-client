import ContainerMain from "@/components/ContainerMain";
import DetailOfProduct from "@/components/DetailOfProduct";
import RelatedProduct from "@/components/RelatedProduct";
import SectionMain from "@/components/SectionMain";
import useCart from "@/hooks/useCart";
import usePrice from "@/hooks/usePrice";
import {reloadWishlist} from "@/redux/slice/dataSlice";
import {AppDispatch} from "@/redux/store";
import {baseService} from "@/service/baseService";
import {ProductType} from "@/types/productType";
import {ProductVariantType} from "@/types/productVariantType";
import {
  checkHasSale,
  checkProductHasVariantSale,
  countVariantSale,
} from "@/utils/checkHasSale";
import {debounce} from "@/utils/debounce";
import {formatMoney} from "@/utils/formatMoney";
import {
  Badge,
  Breadcrumb,
  Col,
  Flex,
  Grid,
  Image,
  Row,
  Typography,
  Statistic,
  Button,
  InputNumber,
} from "antd";
import Head from "next/head";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import {BsCartPlus} from "react-icons/bs";
import {FiHeart} from "react-icons/fi";
import {IoStar} from "react-icons/io5";
import {useDispatch} from "react-redux";
import Slider from "react-slick";

export async function getStaticPaths() {
  const products = await baseService.findAll("products", 1, 9999999, {
    active: true,
  });
  return {
    paths: products?.data.map((product: ProductType) => ({
      params: {slug: product.slug},
    })),
    fallback: false,
  };
}

export async function getStaticProps({params}: {params: {slug: string}}) {
  try {
    const product = await baseService.findOne("products", params.slug);

    if (!product) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        product: product.data,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.log(error);
    return {
      notFound: true,
    };
  }
}

const ProductPage = ({product}: {product: ProductType}) => {
  const dispatch = useDispatch<AppDispatch>();

  const {lg} = Grid.useBreakpoint();

  const {handleAddToCart} = useCart();

  const settings = {
    dots: lg ? true : false,
    infinite: true,
    speed: 2000,
    slidesToShow: lg ? 4 : 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 8000,
    beforeChange: (_current: number, next: number) => {
      setCurrentImage(images[next]);
    },
  };

  const breadcrumbItems = [
    {
      title: <Link href="/">Home</Link>,
    },
    {
      title: <Link href="/shop">Shop</Link>,
    },
    {
      title: product.name,
    },
  ];

  const [images, setImages] = useState<string[]>([
    ...(product.thumbnail ? [product.thumbnail] : []),
    ...product.images,
  ]);
  const [currentImage, setCurrentImage] = useState(product.thumbnail as string);
  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariantType | null>(
      product.hasVariant ? product.variants[0] : null
    );
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizes, setSizes] = useState<string[]>(
    product.hasVariant ? product.variants[0].sizes : []
  );
  const [quantity, setQuantity] = useState(1);

  const {getPrice} = usePrice();

  const handleAddToWishlist = async (productId: string) => {
    await baseService.addToWishlist(productId);
    dispatch(reloadWishlist());
  };

  useEffect(() => {
    if (product.hasVariant) {
      const variantThumbnails = product.variants
        .filter((v) => v.thumbnail && !images.includes(v.thumbnail as string))
        .map((v) => v.thumbnail as string);

      if (variantThumbnails.length > 0) {
        setImages((prev) => [...prev, ...variantThumbnails]);
      }
    }

    if (selectedVariant) {
      if (selectedVariant.thumbnail) {
        setCurrentImage(selectedVariant.thumbnail as string);
      }

      const variant = product.variants.find(
        (v) => v._id === selectedVariant._id
      );
      if (variant) {
        setSizes(variant.sizes);
      }
    }
  }, [product, selectedVariant, images]);

  useEffect(() => {
    setCurrentImage(product.thumbnail as string);
    setImages([
      ...(product.thumbnail ? [product.thumbnail] : []),
      ...product.images,
    ]);
    setSelectedVariant(product.hasVariant ? product.variants[0] : null);
    setSelectedSize(null);
    setQuantity(1);
  }, [product]);

  return (
    <>
      <Head>
        <title>Simple Store | {product.name}</title>
      </Head>
      <Row>
        <ContainerMain>
          <SectionMain space={50}>
            <Breadcrumb items={breadcrumbItems} />

            <Row gutter={[40, 40]} style={{marginTop: 40}}>
              <Col span={lg ? 12 : 24}>
                <Row>
                  <Col span={2}></Col>
                  <Col span={20}>
                    <Image
                      src={currentImage}
                      alt={product.name}
                      width={"100%"}
                      style={{borderRadius: 10, marginBottom: 20}}
                      preview={lg ? true : false}
                    />

                    <div style={{width: "100%", marginTop: 10}}>
                      <Slider {...settings}>
                        {images.map((image, index) => (
                          <div key={index}>
                            <Image
                              src={image}
                              alt={`${product.name}-${index}`}
                              width={"95%"}
                              style={{
                                borderRadius: 5,
                                cursor: "pointer",
                                border: `${
                                  currentImage === image
                                    ? "2px solid #000"
                                    : "1px solid #ccc"
                                }`,
                                padding: 5,
                              }}
                              onClick={() => setCurrentImage(image)}
                              preview={false}
                            />
                          </div>
                        ))}
                      </Slider>
                    </div>
                  </Col>
                  <Col span={2}></Col>
                </Row>
              </Col>
              <Col span={lg ? 12 : 24}>
                <Flex justify="space-between" style={{marginBottom: 10}}>
                  <Typography.Text>{product.supplier.name}</Typography.Text>
                  <Flex gap={10} wrap>
                    {((product.hasSale && checkHasSale(product)) ||
                      checkProductHasVariantSale(product)) && (
                      <Badge
                        count={
                          countVariantSale(product) > 0
                            ? `${countVariantSale(product)} version(s) on sale`
                            : "Sale"
                        }
                        color={"red"}
                      />
                    )}
                    <Badge
                      count={`${
                        product.quantity > 0 ? "In stock" : "Out of stock"
                      }`}
                      color={product.quantity > 0 ? "green" : "red"}
                    />
                  </Flex>
                </Flex>
                <Typography.Title level={lg ? 3 : 4}>
                  {product.name}
                </Typography.Title>
                <Flex
                  vertical={!lg}
                  justify="space-between"
                  gap={10}
                  style={{marginBottom: 10}}
                >
                  <Typography.Text>SKU: {product.sku}</Typography.Text>
                  <Flex gap={10}>
                    <Typography.Text>
                      Total Quantity: {product.quantity}
                    </Typography.Text>
                    |
                    <Typography.Text>
                      Total Sold: {product.soldQuantity}
                    </Typography.Text>
                  </Flex>
                </Flex>
                <Flex
                  align="center"
                  gap={10}
                  style={{marginTop: 10, marginBottom: lg ? 30 : 10}}
                >
                  <div>
                    {Array.from({length: 5}).map((_, index) => (
                      <IoStar key={index} color="#ff8f00" size={20} />
                    ))}
                  </div>
                  <Typography.Text>5.0</Typography.Text>
                  <Typography.Text>(100 reviews)</Typography.Text>
                </Flex>
                <Flex vertical={!lg} justify="space-between" gap={10}>
                  <Flex gap={20}>
                    {getPrice(product, selectedVariant).salePrice && (
                      <Typography.Paragraph
                        style={{
                          fontSize: lg ? 36 : 28,
                          fontWeight: 700,
                        }}
                      >
                        {formatMoney(
                          getPrice(product, selectedVariant).salePrice ?? 0
                        )}
                      </Typography.Paragraph>
                    )}
                    <Typography.Paragraph
                      style={{
                        textDecoration: getPrice(product, selectedVariant)
                          .salePrice
                          ? "line-through"
                          : "",
                        fontSize: lg ? 30 : 26,
                        fontWeight: "normal",
                        marginTop: lg ? 4 : 0,
                      }}
                    >
                      {formatMoney(
                        getPrice(product, selectedVariant).originalPrice
                      )}
                    </Typography.Paragraph>
                  </Flex>
                  {(product.hasSale && checkHasSale(product)) ||
                  (selectedVariant?.hasSale &&
                    checkHasSale(selectedVariant)) ? (
                    <Flex
                      gap={10}
                      align=""
                      style={{width: 200, marginTop: -20}}
                    >
                      <Statistic.Countdown
                        title="Sale end in:"
                        value={new Date(
                          product.saleEndDate ||
                            selectedVariant?.saleEndDate ||
                            Date.now()
                        ).getTime()}
                        format="D[d] H[h] m[m] s[s]"
                        className="custom-countdown"
                      />
                    </Flex>
                  ) : null}
                </Flex>
                <Flex
                  justify="space-between"
                  style={{marginBottom: 10, marginTop: lg ? 0 : 20}}
                >
                  <Typography.Text>{product.shortDescription}</Typography.Text>
                </Flex>
                {product.hasVariant && (
                  <Flex vertical gap={30} style={{marginTop: 40}}>
                    <Flex vertical gap={10}>
                      <Typography.Text style={{fontSize: 18, fontWeight: 500}}>
                        Select Version ({selectedVariant?.quantity} left)
                      </Typography.Text>
                      <Flex gap={10} wrap>
                        {product.variants.map((variant) => (
                          <Button
                            type="default"
                            key={variant._id}
                            onClick={() => setSelectedVariant(variant)}
                            style={{
                              backgroundColor: `${
                                selectedVariant?._id === variant._id
                                  ? "#000"
                                  : "#fff"
                              }`,
                              color: `${
                                selectedVariant?._id === variant._id
                                  ? "#fff"
                                  : "#000"
                              }`,
                            }}
                          >
                            {variant.name}
                          </Button>
                        ))}
                      </Flex>
                    </Flex>
                    {sizes.length > 0 && (
                      <Flex vertical gap={10}>
                        <Typography.Text
                          style={{fontSize: 18, fontWeight: 500}}
                        >
                          Select Size
                        </Typography.Text>
                        <Flex gap={10} wrap>
                          {sizes.map((size) => (
                            <Button
                              key={size}
                              onClick={() => setSelectedSize(size)}
                              style={{
                                backgroundColor: `${
                                  selectedSize === size ? "#000" : "#fff"
                                }`,
                                color: `${
                                  selectedSize === size ? "#fff" : "#000"
                                }`,
                              }}
                            >
                              {size}
                            </Button>
                          ))}
                        </Flex>
                      </Flex>
                    )}
                  </Flex>
                )}

                <Flex vertical gap={10} style={{marginTop: 30}}>
                  <Typography.Text style={{fontSize: 18, fontWeight: 500}}>
                    Quantity
                  </Typography.Text>
                  <Flex gap={10} align="center">
                    <Button
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    >
                      -
                    </Button>
                    <InputNumber
                      value={quantity}
                      onChange={(value) => {
                        if (value) {
                          const debouncedUpdate = debounce(
                            () => setQuantity(value),
                            500
                          );
                          debouncedUpdate();
                        }
                      }}
                      min={1}
                      max={
                        product.hasVariant
                          ? selectedVariant?.quantity
                          : product.quantity
                      }
                      style={{width: 80}}
                      controls={false}
                    />
                    <Button
                      onClick={() => {
                        if (
                          !product.hasVariant &&
                          quantity < product.quantity
                        ) {
                          setQuantity(quantity + 1);
                        } else if (
                          product.hasVariant &&
                          selectedVariant?.quantity &&
                          quantity < selectedVariant?.quantity
                        ) {
                          setQuantity(quantity + 1);
                        }
                      }}
                    >
                      +
                    </Button>
                  </Flex>
                </Flex>

                <Flex style={{marginTop: 30}} gap={10}>
                  <Button
                    type="primary"
                    size={"large"}
                    style={{width: "300px"}}
                    icon={<BsCartPlus />}
                    onClick={() =>
                      handleAddToCart(
                        product,
                        selectedVariant,
                        selectedSize,
                        quantity
                      )
                    }
                    disabled={
                      !product.hasVariant
                        ? product.quantity === 0
                        : selectedVariant?.quantity === 0
                    }
                  >
                    Add to cart
                  </Button>
                  <Button
                    type="default"
                    size={"large"}
                    onClick={() => handleAddToWishlist(product._id)}
                  >
                    <FiHeart />
                  </Button>
                </Flex>
              </Col>
            </Row>

            <Row style={{marginTop: lg ? 100 : 50, width: "100%"}}>
              <DetailOfProduct
                description={product.description}
                productId={product._id}
                slug={product.slug}
              />
            </Row>

            <Row style={{marginTop: 50}}>
              <RelatedProduct
                categoryId={product.category?._id}
                productId={product._id}
              />
            </Row>
          </SectionMain>
        </ContainerMain>
      </Row>
    </>
  );
};

export default ProductPage;
