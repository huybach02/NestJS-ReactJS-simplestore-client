import {settingsSlickSlider} from "@/utils/const";
import {Button, Card, Flex, Image, Typography} from "antd";
import React, {useRef} from "react";
import {FaChevronLeft, FaChevronRight} from "react-icons/fa";
import Slider from "react-slick";
import TitleMain from "./TitleMain";
import customerSay from "@/utils/customerSay.json";
import {IoStar} from "react-icons/io5";

const CustomerSay = () => {
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
          {customerSay &&
            customerSay.length > 0 &&
            customerSay.map((customer, index) => (
              <div key={index}>
                <Card
                  style={{
                    margin: "5px 10px",
                    padding: "30px 10px",
                    boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Flex vertical gap={16}>
                    <Flex>
                      {Array.from({length: customer.rating}).map((_, index) => (
                        <IoStar key={index} color="#ff8f00" size={20} />
                      ))}
                      {Array.from({length: 5 - customer.rating}).map(
                        (_, index) => (
                          <IoStar key={index} color="#e0e0e0" size={20} />
                        )
                      )}
                    </Flex>
                    <Typography.Text>{customer.comment}</Typography.Text>
                    <Flex gap={10} align="center">
                      <Image
                        src={customer.photoUrl}
                        alt={customer.name}
                        preview={false}
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                        }}
                      />
                      <Flex vertical>
                        <Typography.Text
                          style={{fontSize: 16, fontWeight: 600}}
                        >
                          {customer.name}
                        </Typography.Text>
                        <Typography.Text style={{fontSize: 14}}>
                          {customer.position}
                        </Typography.Text>
                      </Flex>
                    </Flex>
                  </Flex>
                </Card>
              </div>
            ))}
        </Slider>
      </div>
    </>
  );
};

export default CustomerSay;
