export type SupplierType = {
  _id: string;
  name: string;
  email: string;
  slug: string;
  product: string;
  category: string[];
  price: string;
  contact: string;
  takingReturn: string;
  photoUrl: string | undefined;
  active: boolean;
  createdAt: string;
};

export type CreateSupplierType = {
  name: string;
  email: string;
  slug: string;
  product: string;
  category: string[];
  price: string;
  contact: string;
  takingReturn: string;
  photoUrl: string | undefined;
  active: boolean;
};
