export type CategoryType = {
  _id: string;
  name: string;
  slug: string;
  parentId: string;
  active: boolean;
  createdAt: string;
  thumbnail: string;
};

export type CreateCategoryType = {
  name: string;
  slug: string;
  superCategory: string;
  active: boolean;
};
