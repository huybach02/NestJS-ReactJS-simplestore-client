import ContainerMain from "@/components/ContainerMain";
import ProductCard from "@/components/ProductCard";
import ProductFilter from "@/components/ProductFilter";
import SectionMain from "@/components/SectionMain";
import {useProductFilter} from "@/hooks/useProductFilter";
import {baseService} from "@/service/baseService";
import {CategoryType} from "@/types/categoryType";
import {ProductType} from "@/types/productType";
import {SupplierType} from "@/types/supplierType";
import {findMaxPrice} from "@/utils/findMaxPrice";
import {
  getChildrenCategorySlug,
  getMultipleChildrenCategories,
  handleTreeValueCustom,
} from "@/utils/handleTreeValue";
import {
  Breadcrumb,
  Button,
  Col,
  Drawer,
  Empty,
  Flex,
  Grid,
  Pagination,
  Row,
  Select,
  Typography,
} from "antd";
import Head from "next/head";
import Link from "next/link";
import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";

const breadcrumbItems = [
  {
    title: <Link href="/">Home</Link>,
  },
  {
    title: "Shop",
  },
];

type Props = {
  categories: CategoryType[];
  products: ProductType[];
  suppliers: SupplierType[];
};

const ShopPage = (props: Props) => {
  const router = useRouter();
  const {lg} = Grid.useBreakpoint();

  const [filter, setFilter] = useState({
    suppliers: router.query.suppliers
      ? (router.query.suppliers as string).split(",")
      : [],
    categories: router.query.categories
      ? getChildrenCategorySlug(
          props.categories,
          router.query.categories as string
        )
      : [],
    price: router.query.price
      ? (router.query.price as string).split("-").map(Number)
      : [0, findMaxPrice(props.products)],
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const categoriesFilter = getMultipleChildrenCategories(
    props.categories,
    filter.categories
  );

  const currentQuery = {...router.query};

  useEffect(() => {
    if (filter.categories.length > 0 && categoriesFilter.length > 0) {
      const currentCategory = router.query.categories as string;
      if (currentCategory !== categoriesFilter[0]) {
        currentQuery.categories = categoriesFilter[0];
      }
    } else {
      delete currentQuery.categories;
    }

    if (
      filter.price[0] !== 0 ||
      filter.price[1] !== findMaxPrice(props.products)
    ) {
      currentQuery.price = `${filter.price[0]}-${filter.price[1]}`;
    } else {
      delete currentQuery.price;
    }

    if (filter.suppliers.length > 0) {
      currentQuery.suppliers = filter.suppliers.join(",");
    } else {
      delete currentQuery.suppliers;
    }

    router.push(
      {
        pathname: "/shop",
        query: currentQuery,
      },
      undefined,
      {shallow: true}
    );
  }, [props.products, filter.categories, filter.price, filter.suppliers]);

  const {ITEMS_PER_PAGE, productsData, total} = useProductFilter(
    props.products,
    props.categories,
    props.suppliers,
    setIsDrawerOpen
  );

  const treeCategories = handleTreeValueCustom(
    props.categories,
    "parentId",
    true
  );

  return (
    <>
      <Head>
        <title>Simple Store | Shop</title>
      </Head>

      <Row>
        <ContainerMain>
          <SectionMain space={50}>
            <Breadcrumb items={breadcrumbItems} />
          </SectionMain>
          <SectionMain space={50}>
            <Row>
              <Col span={6} style={{display: lg ? "block" : "none"}}>
                <ProductFilter
                  categories={treeCategories}
                  suppliers={props.suppliers}
                  filter={filter}
                  setFilter={setFilter}
                  maxPrice={findMaxPrice(props.products)}
                />
              </Col>
              <Col span={lg ? 1 : 0}></Col>
              <Button
                type="primary"
                style={{marginBottom: 40, display: lg ? "none" : "block"}}
                onClick={() => setIsDrawerOpen(true)}
              >
                Filter Products
              </Button>
              <Col span={lg ? 17 : 24}>
                <Flex justify="space-between" style={{marginBottom: 20}}>
                  <Typography.Title level={5}>
                    Show{" "}
                    {(Number(router.query.page || 1) - 1) * ITEMS_PER_PAGE + 1}-
                    {Math.min(
                      Number(router.query.page || 1) * ITEMS_PER_PAGE,
                      total
                    )}{" "}
                    of {total} products
                  </Typography.Title>
                  <Select
                    options={[
                      {label: "Newest", value: "newest"},
                      {label: "Oldest", value: "oldest"},
                    ]}
                    style={{width: 200}}
                    defaultValue={(router.query.sortBy as string) || "newest"}
                    onChange={(value) => {
                      currentQuery.sortBy = value;
                      router.push({
                        pathname: "/shop",
                        query: currentQuery,
                      });
                    }}
                  />
                </Flex>

                <Row gutter={[20, 20]}>
                  {productsData.map((product: ProductType) => (
                    <Col span={lg ? 6 : 12} key={product._id}>
                      <ProductCard product={product} />
                    </Col>
                  ))}
                  {productsData.length === 0 && (
                    <Col span={24}>
                      <Empty description="No products found" />
                    </Col>
                  )}
                </Row>

                <Flex justify="center" style={{marginTop: 100}}>
                  <Pagination
                    total={total}
                    pageSize={ITEMS_PER_PAGE}
                    current={Number(router.query.page || 1)}
                    showSizeChanger={false}
                    onChange={(page) => {
                      currentQuery.page = page.toString();
                      router.push({
                        pathname: "/shop",
                        query: currentQuery,
                      });
                    }}
                  />
                </Flex>
              </Col>
            </Row>
          </SectionMain>
        </ContainerMain>
      </Row>
      <Drawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Filter Products"
        style={{display: lg ? "none" : "block"}}
      >
        <ProductFilter
          categories={treeCategories}
          suppliers={props.suppliers}
          filter={filter}
          setFilter={setFilter}
          maxPrice={findMaxPrice(props.products)}
        />
      </Drawer>
    </>
  );
};

export default ShopPage;

export async function getStaticProps() {
  const categories = await baseService.findAll("categories", 1, 99999, {
    active: true,
  });

  const products = await baseService.findAll("products", 1, 9999999, {
    active: true,
  });

  const suppliers = await baseService.findAll("suppliers", 1, 9999999, {
    active: true,
  });

  return {
    props: {
      categories: categories?.data,
      products: products?.data,
      suppliers: suppliers?.data,
    },
    revalidate: 30,
  };
}
