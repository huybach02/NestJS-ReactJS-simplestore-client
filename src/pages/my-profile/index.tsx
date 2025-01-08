import {Breadcrumb, Grid, Tabs, Typography} from "antd";
import ContainerMain from "@/components/ContainerMain";
import {Row} from "antd";
import Head from "next/head";
import React from "react";
import SectionMain from "@/components/SectionMain";
import {
  LuHeart,
  LuMapPin,
  LuSettings,
  LuShoppingBag,
  LuUser,
} from "react-icons/lu";
import PersonalInformation from "@/components/PersonalInformation";
import Link from "next/link";
import ManageAddress from "../../components/ManageAddress";
import CustomerOrder from "@/components/CustomerOrder";
import ChangePassword from "@/components/ChangePassword";
import Wishlist from "@/components/Wishlist";
import {useRouter} from "next/router";

const Profile = () => {
  const {lg} = Grid.useBreakpoint();

  const router = useRouter();

  const [activeTab, setActiveTab] = React.useState(
    router.query.activeTab || sessionStorage.getItem("activeTab") || "1"
  );

  const breadcrumbItems = [
    {
      title: <Link href="/">Home</Link>,
    },
    {
      title: "Customer Dashboard",
    },
  ];

  const tabItems = [
    {
      label: "Personal Information",
      key: "personal-information",
      icon: <LuUser size={20} />,
      children: <PersonalInformation />,
    },
    {
      label: "My Orders",
      key: "my-orders",
      icon: <LuShoppingBag size={20} />,
      children: <CustomerOrder />,
    },
    {
      label: "My Wishlists",
      key: "my-wishlists",
      icon: <LuHeart size={20} />,
      children: <Wishlist />,
    },
    {
      label: "Manage Addresses",
      key: "manage-addresses",
      icon: <LuMapPin size={20} />,
      children: <ManageAddress />,
    },
    {
      label: "Change Password",
      key: "change-password",
      icon: <LuSettings size={20} />,
      children: <ChangePassword />,
    },
  ];

  return (
    <>
      <Head>
        <title>Simple Store | My Profile</title>
      </Head>
      <Row>
        <ContainerMain>
          <SectionMain space={50}>
            <Breadcrumb items={breadcrumbItems} />
          </SectionMain>
          <SectionMain space={50}>
            <Typography.Title level={2}>My Profile</Typography.Title>
          </SectionMain>
          <SectionMain space={50}>
            <Tabs
              tabPosition={lg ? "left" : "top"}
              items={tabItems}
              size="middle"
              activeKey={activeTab as string}
              onTabClick={(key) => {
                setActiveTab(key);
                router.push(`/my-profile?activeTab=${key}`);
                sessionStorage.setItem("activeTab", key);
              }}
            />
          </SectionMain>
        </ContainerMain>
      </Row>
    </>
  );
};

export default Profile;
