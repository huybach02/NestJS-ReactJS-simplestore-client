import CategoriesSlider from "@/components/CategoriesSlider";
import ContainerMain from "@/components/ContainerMain";
import CustomerSay from "@/components/CustomerSay";
import FeaturedSupplier from "@/components/FeaturedSupplier";
import OurBestSeller from "@/components/OurBestSeller";
import OurPromise from "@/components/OurPromise";
import SectionMain from "@/components/SectionMain";
import SliderMain from "@/components/SliderMain";
import {baseService} from "@/service/baseService";
import {productService} from "@/service/productService";
import {CategoryType} from "@/types/categoryType";
import {ProductType} from "@/types/productType";
import {SupplierType} from "@/types/supplierType";
import {Row} from "antd";
import Head from "next/head";
import React from "react";

export async function getStaticProps() {
  const sliders = [
    {
      id: 1,
      title: "Lorem ipsum dolor sit amet consectetur. 1",
      description: "Lorem ipsum dolor sit amet consectetur.",
      image:
        "https://res.cloudinary.com/dveqjgj4l/image/upload/v1735054090/simplestore/lyyseyki4ujgqmn52eil.png",
      btnText: "Shop Now",
      btnLink: "/",
    },
    {
      id: 2,
      title: "Lorem ipsum dolor sit amet consectetur. 2",
      description: "Lorem ipsum dolor sit amet consectetur.",
      image:
        "https://res.cloudinary.com/dveqjgj4l/image/upload/v1735054090/simplestore/lyyseyki4ujgqmn52eil.png",
      btnText: "Shop Now",
      btnLink: "/",
    },
    {
      id: 3,
      title: "Lorem ipsum dolor sit amet consectetur. 3",
      description: "Lorem ipsum dolor sit amet consectetur.",
      image:
        "https://res.cloudinary.com/dveqjgj4l/image/upload/v1735054090/simplestore/lyyseyki4ujgqmn52eil.png",
      btnText: "Shop Now",
      btnLink: "/",
    },
    {
      id: 4,
      title: "Lorem ipsum dolor sit amet consectetur. 4",
      description: "Lorem ipsum dolor sit amet consectetur.",
      image:
        "https://res.cloudinary.com/dveqjgj4l/image/upload/v1735054090/simplestore/lyyseyki4ujgqmn52eil.png",
      btnText: "Shop Now",
      btnLink: "/",
    },
  ];

  const websiteData = await baseService.getAllManageWebsite();

  const categories = await baseService.findAll("categories", 1, 99999, {
    active: true,
  });

  const bestSelling = await productService.bestSelling(12);

  const suppliers = await baseService.findAll("suppliers", 1, 9999999, {
    active: true,
  });

  return {
    props: {
      sliders,
      websiteData: websiteData?.data,
      categories: categories?.data?.filter(
        (category: CategoryType) => !category.parentId
      ),
      bestSelling: bestSelling?.data,
      suppliers: suppliers?.data,
    },
    revalidate: 30,
  };
}

type Props = {
  categories: CategoryType[];
  bestSelling: ProductType[];
  suppliers: SupplierType[];
  websiteData: {
    homeSlider: {
      id: number;
      title: string;
      description: string;
      image: string;
      btnText: string;
      btnLink: string;
    }[];
    homeCommitment: {
      id: number;
      icon: string;
      title: string;
      description: string;
    }[];
  };
};

const MainPage = (props: Props) => {
  console.log(props.websiteData);

  return (
    <>
      <Head>
        <title>Simple Store | Home</title>
      </Head>
      <div style={{marginTop: "50px"}}>
        {props.websiteData?.homeSlider &&
          props.websiteData?.homeSlider.length > 0 && (
            <SliderMain sliders={props.websiteData?.homeSlider} />
          )}
        <Row>
          <ContainerMain>
            <SectionMain>
              {props.categories.length > 0 && (
                <CategoriesSlider categories={props.categories} />
              )}
            </SectionMain>
            <SectionMain>
              <OurBestSeller bestSelling={props.bestSelling} />
            </SectionMain>
            {/* <SectionMain space={0}>
              <DualBanner />
            </SectionMain> */}
            <SectionMain>
              <FeaturedSupplier suppliers={props.suppliers} />
            </SectionMain>
            <SectionMain>
              <CustomerSay />
            </SectionMain>
            <SectionMain>
              <OurPromise promise={props.websiteData?.homeCommitment} />
            </SectionMain>
          </ContainerMain>
        </Row>
      </div>
    </>
  );
};

export default MainPage;
