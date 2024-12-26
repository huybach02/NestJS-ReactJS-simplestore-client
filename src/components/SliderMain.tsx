import {limitText} from "@/utils/limitText";
import {Button, Carousel, Flex, Grid, Image, Typography} from "antd";
import Link from "next/link";

type Props = {
  sliders: {
    id: number;
    title: string;
    description: string;
    image: string;
    btnText: string;
    btnLink: string;
  }[];
};

const SliderMain = ({sliders = []}: Props) => {
  const {lg} = Grid.useBreakpoint();

  const contentStyle: React.CSSProperties = {
    margin: 0,
    height: lg ? "600px" : "350px",
    color: "#fff",
    textAlign: "center",
    background: "#364d79",
    position: "relative",
  };

  const overlayStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1,
  };

  const textContainerStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    left: "10%",
    transform: "translateY(-50%)",
    zIndex: 2,
    color: "#fff",
    textAlign: "left",
    width: lg ? "40%" : "80%",
  };

  return (
    <>
      <Carousel arrows infinite={true} autoplay autoplaySpeed={5000}>
        {sliders.map((slider) => (
          <div key={slider.id}>
            <div style={contentStyle}>
              <Image
                src={slider.image}
                alt="slider-1"
                width={"100%"}
                height={"100%"}
                preview={false}
              />
              <div style={overlayStyle}></div>
              <div style={textContainerStyle}>
                <Flex vertical gap={20}>
                  <Typography.Title
                    level={lg ? 2 : 5}
                    style={{color: "#fff", marginBottom: "8px"}}
                  >
                    {slider.title}
                  </Typography.Title>
                  <Typography.Paragraph
                    style={{
                      color: "#fff",
                      marginBottom: "8px",
                      textAlign: "justify",
                    }}
                  >
                    {lg
                      ? slider.description
                      : limitText(slider.description, 170)}
                  </Typography.Paragraph>
                  <Link href={slider.btnLink || "/"}>
                    <Button
                      type="default"
                      size={lg ? "large" : "small"}
                      style={{
                        width: lg ? "200px" : "120px",
                        fontSize: lg ? "16px" : "14px",
                      }}
                    >
                      {slider.btnText}
                    </Button>
                  </Link>
                </Flex>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </>
  );
};

export default SliderMain;
