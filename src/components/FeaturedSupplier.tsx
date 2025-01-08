import {SupplierType} from "@/types/supplierType";
import {settingsSlickSlider} from "@/utils/const";
import {Button, Card, Flex, Image} from "antd";
import React, {useRef} from "react";
import {FaChevronLeft, FaChevronRight} from "react-icons/fa";
import Slider from "react-slick";
import TitleMain from "./TitleMain";

const FeaturedSupplier = ({suppliers}: {suppliers: SupplierType[]}) => {
  const sliderRef = useRef<Slider>(null);

  const handlePrev = () => {
    sliderRef.current?.slickPrev();
  };

  const handleNext = () => {
    sliderRef.current?.slickNext();
  };

  return (
    <>
      <TitleMain title="Featured Suppliers" />
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
          {suppliers &&
            suppliers.length > 0 &&
            suppliers.map((supplier, index) => (
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
                    style={{height: "240px"}}
                    gap={10}
                  >
                    <Image
                      src={supplier.photoUrl}
                      alt={supplier.name}
                      preview={false}
                      style={{
                        maxWidth: "240px",
                        maxHeight: "240px",
                        margin: "auto",
                        borderRadius: "6px",
                      }}
                    />
                  </Flex>
                </Card>
              </div>
            ))}
        </Slider>
      </div>
    </>
  );
};

export default FeaturedSupplier;
