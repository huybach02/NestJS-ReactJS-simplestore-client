import {useDispatch} from "react-redux";
import {useEffect, useState} from "react";
import {AppProps} from "next/app";
import Loading from "@/components/Loading";
import {Layout} from "antd";
import {setUser} from "@/redux/slice/userSlice";
import {authService} from "@/service/authService";
import {usePathname} from "next/navigation";
import HeaderCustom from "@/components/HeaderCustom";

type RouterProps = {
  Component: AppProps["Component"];
  pageProps: AppProps["pageProps"];
};

const Routers = ({Component, pageProps}: RouterProps) => {
  const dispatch = useDispatch();

  const pathname = usePathname();

  const [isLoading, setIsLoading] = useState(true);

  const getMe = async () => {
    const user = await authService.me();
    if (user && "success" in user) {
      dispatch(setUser(user.data));
    }
  };

  useEffect(() => {
    getMe();
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

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
      <Layout.Footer style={{backgroundColor: "#fff"}}>Footer</Layout.Footer>
    </Layout>
  );
};

export default Routers;
