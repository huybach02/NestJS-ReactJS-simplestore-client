import ContainerMain from "@/components/ContainerMain";
import SectionMain from "@/components/SectionMain";
import {baseService} from "@/service/baseService";
import {Row} from "antd";
import Head from "next/head";
import React, {useEffect, useState} from "react";

const AboutUs = () => {
  const [content, setContent] = useState<string>("");

  const fetchAboutUsContent = async () => {
    const response = await baseService.getAllManageWebsite();
    setContent(response.data.aboutUsContent);
  };

  useEffect(() => {
    fetchAboutUsContent();
  }, []);

  return (
    <>
      <Head>
        <title>Simple Store | About Us</title>
      </Head>
      <Row>
        <ContainerMain>
          <SectionMain>
            <div dangerouslySetInnerHTML={{__html: content}} />
          </SectionMain>
        </ContainerMain>
      </Row>
    </>
  );
};

export default AboutUs;
