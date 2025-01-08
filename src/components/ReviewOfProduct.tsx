import {
  Avatar,
  Button,
  Card,
  Divider,
  Flex,
  Form,
  Image,
  Input,
  message,
  Modal,
  Rate,
  Typography,
} from "antd";
import React, {useEffect, useState} from "react";
import {IoStar, IoStarOutline} from "react-icons/io5";
import ImageUploadZone from "./ImageUploadZone";
import {reviewService} from "@/service/reviewService";
import {ReviewType} from "@/types/reviewType";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {RootState} from "@/redux/store";
import {useSelector} from "react-redux";
import {useRouter} from "next/router";

dayjs.extend(relativeTime);

type ReviewForm = {
  rating: number;
  title: string;
  review: string;
  images?: string[];
};

const ReviewOfProduct = ({
  productId,
  slug,
}: {
  productId: string;
  slug: string;
}) => {
  const router = useRouter();

  const {user} = useSelector((state: RootState) => state.user);

  const [open, setOpen] = useState(false);
  const [imageLists, setImageLists] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const [reviews, setReviews] = useState<ReviewType[]>([]);

  const [form] = Form.useForm();

  const fetchReviews = async () => {
    const response = await reviewService.getReviews(productId);
    setReviews(response?.data || []);
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmit = async (values: ReviewForm) => {
    delete values.images;

    setLoading(true);
    await reviewService.addReview({
      ...values,
      images: imageLists,
      productId,
    });
    setLoading(false);
    setOpen(false);
    setImageLists([]);
    form.resetFields();
    fetchReviews();
  };

  return (
    <>
      <Flex vertical gap={10}>
        <Flex vertical>
          <Typography.Title level={4}>Customer Reviews</Typography.Title>
          <Typography.Text>({reviews.length} reviews)</Typography.Text>
        </Flex>
        <Button
          type="primary"
          size="large"
          style={{width: "fit-content"}}
          onClick={() => {
            if (!user) {
              message.error("Please login first to add to cart");
              router.push(`/auth/login?product=${slug}`);
              return;
            }
            setOpen(true);
          }}
        >
          Write a review
        </Button>
      </Flex>

      <div style={{marginTop: 40, maxHeight: 1000, overflow: "auto"}}>
        {reviews.map((review) => (
          <div key={review._id}>
            <Flex vertical gap={20}>
              <Flex justify="start" align="center" gap={20}>
                <Avatar
                  src={
                    review.userId?.avatar ||
                    "https://static-00.iconduck.com/assets.00/profile-circle-icon-256x256-cm91gqm2.png"
                  }
                  size={"large"}
                  style={{border: "1px solid #e0e0e0"}}
                />
                <Flex vertical>
                  <Typography.Text style={{fontWeight: 600, fontSize: 18}}>
                    {review.userId?.name}
                  </Typography.Text>
                  <Flex gap={5}>
                    {Array.from({length: review.rating}).map((_, index) => (
                      <IoStar key={index} color="#ff8f00" size={14} />
                    ))}
                    {Array.from({length: 5 - review.rating}).map((_, index) => (
                      <IoStarOutline key={index} color="#ff8f00" size={14} />
                    ))}
                  </Flex>
                </Flex>
              </Flex>
              <Flex vertical gap={10}>
                <Typography.Title level={5}>{review.title}</Typography.Title>
                <Typography.Text style={{fontSize: 14}}>
                  {review.review}
                </Typography.Text>
                {review?.images && review?.images?.length > 0 && (
                  <Flex justify="start" gap={10}>
                    {review.images?.map((image) => (
                      <Image
                        key={image}
                        src={image}
                        alt="review"
                        width={70}
                        height={70}
                        style={{borderRadius: 10}}
                      />
                    ))}
                  </Flex>
                )}
                <Typography.Text style={{fontSize: 14}}>
                  Posted on{" "}
                  {review?.createdAt ? dayjs(review.createdAt).fromNow() : ""}
                </Typography.Text>
              </Flex>
            </Flex>
            {review?.replyByAdmin && (
              <Card style={{marginTop: 20, marginLeft: 40}}>
                <Flex
                  justify="start"
                  align="center"
                  gap={20}
                  style={{marginBottom: 20}}
                >
                  <Image
                    src={process.env.NEXT_PUBLIC_APP_LOGO_URL}
                    alt="logo"
                    width={70}
                  />
                  <Flex vertical>
                    <Typography.Text style={{fontWeight: 600, fontSize: 18}}>
                      Simple Store
                    </Typography.Text>
                  </Flex>
                </Flex>
                <Typography.Text>{review.replyByAdmin}</Typography.Text>
              </Card>
            )}
            <Divider />
          </div>
        ))}
      </div>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        title="Write a review"
      >
        <Form
          layout="vertical"
          size="large"
          form={form}
          onFinish={handleSubmit}
        >
          <Form.Item label="Your rating" name="rating">
            <Rate count={5} style={{fontSize: 20, color: "#ff8f00"}} />
          </Form.Item>
          <Form.Item label="Title" name="title">
            <Input />
          </Form.Item>
          <Form.Item label="Your Review" name="review">
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="Images (optional, limit 5 images)" name="images">
            <ImageUploadZone setImageLists={setImageLists} multiple />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{width: "100%"}}
              loading={loading}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ReviewOfProduct;
