/* eslint-disable react-hooks/exhaustive-deps */
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {AppProps} from "next/app";
import Loading from "@/components/Loading";
import {Layout} from "antd";
import {setUser} from "@/redux/slice/userSlice";
import {authService} from "@/service/authService";
import {usePathname} from "next/navigation";
import HeaderCustom from "@/components/HeaderCustom";
import FooterMain from "@/components/FooterMain";
import useCart from "@/hooks/useCart";
import {RootState} from "@/redux/store";
import MiniCart from "@/components/MiniCart";
import {baseService} from "@/service/baseService";
import {setWishlist} from "@/redux/slice/dataSlice";

type RouterProps = {
  Component: AppProps["Component"];
  pageProps: AppProps["pageProps"];
};

const Routers = ({Component, pageProps}: RouterProps) => {
  const dispatch = useDispatch();
  const {user} = useSelector((state: RootState) => state.user);

  const pathname = usePathname();

  const [isLoading, setIsLoading] = useState(true);

  const {getCart} = useCart();

  const getMe = async () => {
    const user = await authService.me();

    if (user && "success" in user) {
      dispatch(setUser(user.data));
    }
  };

  const getWishlist = async () => {
    const wishlist = await baseService.getWishlist();
    dispatch(setWishlist(wishlist.data));
  };

  useEffect(() => {
    getMe();
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (user) {
      getCart();
      getWishlist();
    }
  }, [user]);

  return isLoading ? (
    <Loading />
  ) : pathname && pathname.includes("/auth") ? (
    <Layout>
      <Layout.Content style={{backgroundColor: "#fff"}}>
        <Component {...pageProps} />
      </Layout.Content>
    </Layout>
  ) : (
    <Layout>
      <Layout.Header style={{backgroundColor: "#fff", paddingTop: "20px"}}>
        <HeaderCustom />
      </Layout.Header>
      <Layout.Content style={{backgroundColor: "#fff"}}>
        <Component {...pageProps} />
      </Layout.Content>
      <Layout.Footer style={{backgroundColor: "#fff"}}>
        <FooterMain />
      </Layout.Footer>
      <MiniCart />
    </Layout>
  );
};

export default Routers;
