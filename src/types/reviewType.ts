export type ReviewType = {
  _id?: string;
  userId?: {
    name: string;
    avatar: string;
  };
  productId: string;
  rating: number;
  title: string;
  review: string;
  images?: string[];
  createdAt?: Date;
  replyByAdmin?: string;
};
