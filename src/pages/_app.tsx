import React from "react";
import {ConfigProvider} from "antd";
import theme from "@/theme/themeConfig";
import "@/styles/globals.css";
import Routers from "@/routes/Routers";
import {Provider} from "react-redux";
import {store} from "@/redux/store";
import {AppProps} from "next/app";

const App = ({Component, pageProps}: AppProps) => {
  return (
    <ConfigProvider theme={theme}>
      <Provider store={store}>
        <Routers Component={Component} pageProps={pageProps} />
      </Provider>
    </ConfigProvider>
  );
};

export default App;
