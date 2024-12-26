import ContainerMain from "@/components/ContainerMain";
import SectionMain from "@/components/SectionMain";
import {Breadcrumb, Row} from "antd";
import Head from "next/head";
import Link from "next/link";
import React from "react";

const breadcrumbItems = [
  {
    title: <Link href="/">Home</Link>,
  },
  {
    title: "Shop",
  },
];

const ShopPage = () => {
  // const searchParams = useSearchParams();
  // const category = searchParams.get("category");
  // console.log(category);

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
        </ContainerMain>
      </Row>
    </>
  );
};

export default ShopPage;
