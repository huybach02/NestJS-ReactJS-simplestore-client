export type RegisterType = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

export type LoginType = {
  email: string;
  password: string;
  remember: boolean;
};

export type SocialLoginType = {
  name: string | null;
  email: string | null;
  avatar: string | null;
  accountType: string | null;
};
