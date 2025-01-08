import {Collapse, Flex, Tabs} from "antd";
import React, {useEffect, useState} from "react";
import ReviewOfProduct from "./ReviewOfProduct";
import {baseService} from "@/service/baseService";

const DetailOfProduct = ({
  description,
  productId,
  slug,
}: {
  description: string;
  productId: string;
  slug: string;
}) => {
  const [questionAnswer, setQuestionAnswer] = useState([]);

  const getQuestionAnswer = async () => {
    const res = await baseService.getAllManageWebsite();
    setQuestionAnswer(
      res.data.productQuestionAnswer.map(
        (item: {id: string; question: string; answer: string}) => ({
          id: item.id,
          label: item.question,
          children: <div>{item.answer}</div>,
        })
      )
    );
  };

  useEffect(() => {
    getQuestionAnswer();
  }, []);

  return (
    <>
      <Flex justify="start" align="center">
        <Tabs
          style={{width: "100%", fontWeight: 500}}
          items={[
            {
              label: "Description",
              key: "description",
              children: (
                <div
                  dangerouslySetInnerHTML={{__html: description}}
                  style={{padding: "0 30px"}}
                />
              ),
            },
            {
              label: "Questions & Answers",
              key: "questions-answers",
              children: (
                <>
                  <Collapse
                    items={questionAnswer}
                    defaultActiveKey={["1"]}
                    style={{width: "100%"}}
                  />
                </>
              ),
            },
            {
              label: "Reviews",
              key: "reviews",
              children: <ReviewOfProduct productId={productId} slug={slug} />,
            },
          ]}
        />
      </Flex>
    </>
  );
};

export default DetailOfProduct;
