import CategoriesSlider from "@/components/CategoriesSlider";
import ContainerMain from "@/components/ContainerMain";
import OurBestSeller from "@/components/OurBestSeller";
import SectionMain from "@/components/SectionMain";
import SliderMain from "@/components/SliderMain";
import {baseService} from "@/service/baseService";
import {productService} from "@/service/productService";
import {CategoryType} from "@/types/categoryType";
import {ProductType} from "@/types/productType";
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

  const categories = await baseService.findAll("categories", 1, 99999, {
    active: true,
  });

  const bestSelling = await productService.bestSelling(12);

  return {
    props: {
      sliders,
      categories: categories.data.filter(
        (category: CategoryType) => !category.parentId
      ),
      bestSelling: bestSelling.data,
    },
    revalidate: 30,
  };
}

type Props = {
  sliders: {
    id: number;
    title: string;
    description: string;
    image: string;
    btnText: string;
    btnLink: string;
  }[];
  categories: CategoryType[];
  bestSelling: ProductType[];
};

const MainPage = (props: Props) => {
  return (
    <>
      <Head>
        <title>Simple Store | Home</title>
      </Head>
      <div style={{marginTop: "50px"}}>
        {props.sliders.length > 0 && <SliderMain sliders={props.sliders} />}
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
          </ContainerMain>
        </Row>
      </div>
    </>
  );
};

export default MainPage;
