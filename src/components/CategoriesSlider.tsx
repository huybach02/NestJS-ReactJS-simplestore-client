import React, {useRef} from "react";
import TitleMain from "./TitleMain";
import Slider from "react-slick";
import {CategoryType} from "@/types/categoryType";
import {Button, Card, Flex, Image} from "antd";
import {settingsSlickSlider} from "@/utils/const";
import {FaChevronLeft, FaChevronRight} from "react-icons/fa";
import Link from "next/link";

const CategoriesSlider = ({categories}: {categories: CategoryType[]}) => {
  const sliderRef = useRef<Slider>(null);

  const handlePrev = () => {
    sliderRef.current?.slickPrev();
  };

  const handleNext = () => {
    sliderRef.current?.slickNext();
  };

  return (
    <>
      <TitleMain title="Shop By Categories" />
      <Flex gap={10} justify="center" style={{marginBottom: 20}}>
        <Button onClick={handlePrev}>
          <FaChevronLeft />
        </Button>
        <Button onClick={handleNext}>
          <FaChevronRight />
        </Button>
      </Flex>
      <div className="slider-container">
        <Slider ref={sliderRef} {...settingsSlickSlider}>
          {categories.map((category, index) => (
            <div key={index}>
              <Card
                style={{
                  margin: "5px 10px",
                  padding: "30px 10px",
                  boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
                }}
              >
                <Flex
                  justify="center"
                  align="center"
                  vertical
                  style={{height: "350px"}}
                  gap={10}
                >
                  <Image
                    src={category.thumbnail}
                    alt={category.name}
                    preview={false}
                    style={{
                      height: "350px",
                      maxWidth: "240px",
                      margin: "auto",
                      borderRadius: "6px",
                    }}
                  />
                  <Link
                    href={`/shop?category=${category.slug}`}
                    style={{width: "95%", margin: "auto"}}
                  >
                    <Button
                      type="dashed"
                      style={{width: "100%", color: "#000"}}
                    >
                      {category.name}
                    </Button>
                  </Link>
                </Flex>
              </Card>
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
};

export default CategoriesSlider;
