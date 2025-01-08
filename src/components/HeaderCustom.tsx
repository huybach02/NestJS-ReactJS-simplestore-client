/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import useCart from "@/hooks/useCart";
import useTreeValue from "@/hooks/useTreeValue";
import {clearCart} from "@/redux/slice/cartSlice";
import {clearWishlist, setShowMiniCart} from "@/redux/slice/dataSlice";
import {removeUser} from "@/redux/slice/userSlice";
import {RootState} from "@/redux/store";
import {authService} from "@/service/authService";
import {baseService} from "@/service/baseService";
import {handleTreeValueCustom} from "@/utils/handleTreeValue";
import {
  Avatar,
  Badge,
  Button,
  Col,
  Divider,
  Drawer,
  Dropdown,
  Flex,
  Grid,
  Image,
  Input,
  Menu,
  MenuProps,
  Row,
  Space,
  Tree,
  Typography,
} from "antd";
import Link from "next/link";
import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import {FaCaretDown, FaCaretRight} from "react-icons/fa";
import {FiHeart, FiShoppingCart} from "react-icons/fi";
import {IoMdLogOut} from "react-icons/io";
import {IoClose} from "react-icons/io5";
import {LuMenu} from "react-icons/lu";
import {useDispatch, useSelector} from "react-redux";

const HeaderCustom = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const {handleTreeValue} = useTreeValue();
  const {cart} = useCart();

  const {lg} = Grid.useBreakpoint();

  const {user} = useSelector((state: RootState) => state.user);
  const {wishlist} = useSelector((state: RootState) => state.data);
  const [categories, setCategories] = useState<any[]>([]);
  const [categoriesCustom, setCategoriesCustom] = useState<any[]>([]);
  const [currentPath, setCurrentPath] = useState<string>("home");
  const [check, setCheck] = useState<boolean>(false);

  const [open, setOpen] = useState<boolean>(false);

  const items: MenuProps["items"] = [
    {
      label: (
        <Typography.Text style={{display: !lg ? "block" : "none"}}>
          Hello, {user?.name}!
        </Typography.Text>
      ),
      disabled: true,
      key: "0",
    },
    {
      label: (
        <Divider
          style={{margin: 0, padding: 0, display: !lg ? "block" : "none"}}
        />
      ),
      disabled: true,
      key: "1",
    },
    {
      label: (
        <Link
          href="/my-profile?activeTab=personal-information"
          rel="noopener noreferrer"
        >
          My Profile
        </Link>
      ),
      key: "2",
    },
    {
      label: (
        <Link href="/my-profile?activeTab=my-orders" rel="noopener noreferrer">
          My Orders
        </Link>
      ),
      key: "3",
    },
    {
      label: (
        <Link
          href="/my-profile?activeTab=my-wishlists"
          rel="noopener noreferrer"
        >
          My Wishlists
        </Link>
      ),
      key: "4",
    },
    {
      type: "divider",
    },
    {
      label: (
        <Flex justify="space-between" align="center">
          <Typography.Text style={{color: "red"}}>Logout</Typography.Text>
          <IoMdLogOut color="red" size={20} />
        </Flex>
      ),
      key: "5",
      onClick: async () => {
        await authService.logout();
        dispatch(removeUser());
        dispatch(clearCart());
        dispatch(clearWishlist());
        router.push("/");
      },
    },
  ];

  const fetchCategories = async () => {
    const res = await baseService.findAll("categories", 1, 99999, {
      active: true,
    });
    setCategories(handleTreeValue(res?.data, "parentId"));
    setCategoriesCustom(handleTreeValueCustom(res?.data, "parentId"));
  };

  useEffect(() => {
    fetchCategories();

    const path = router.pathname;
    if (path === "/") {
      setCurrentPath("home");
    } else {
      setCurrentPath(path.substring(1));
    }

    setOpen(false);
  }, [router.pathname, check]);

  return (
    <>
      <Row>
        <Col span={lg ? 1 : 0}></Col>
        <Col
          span={lg ? 0 : 5}
          style={{
            display: !lg ? "flex" : "none",
            justifyContent: "start",
            alignItems: "center",
          }}
        >
          <Flex justify="start" align="center">
            <LuMenu size={30} onClick={() => setOpen(true)} />
          </Flex>
        </Col>
        <Col span={lg ? 3 : 2}>
          <Link href="/">
            <Image
              src={process.env.NEXT_PUBLIC_APP_LOGO_URL}
              alt="logo"
              width={lg ? 200 : 130}
              preview={false}
            />
          </Link>
        </Col>
        <Col span={lg ? 11 : 8} style={{padding: "0 30px"}}>
          <Menu
            selectedKeys={[currentPath]}
            items={[
              {
                label: <Link href="/">Home</Link>,
                key: "home",
              },
              {
                label: (
                  <Dropdown menu={{items: categories}}>
                    <Link href="/shop">
                      <Flex align="center" gap={5}>
                        Shop
                        <FaCaretDown />
                      </Flex>
                    </Link>
                  </Dropdown>
                ),
                key: "categories/[id]",
              },
              {
                label: <Link href="/about-us">About Us</Link>,
                key: "about-us",
              },
              // {
              //   label: "Blog",
              //   key: "blog",
              // },
              // {
              //   label: "Contact Us",
              //   key: "contact-us",
              // },
            ]}
            mode="horizontal"
            style={{
              display: lg ? "flex" : "none",
              width: "100%",
              justifyContent: "center",
            }}
          />
        </Col>
        <Col span={lg ? 8 : 9}>
          <Row align="middle" gutter={16}>
            <Col span={lg ? 8 : 0} style={{display: !lg ? "none" : "block"}}>
              <Input.Search
                placeholder="Search..."
                width={50}
                style={{display: "flex", alignItems: "center"}}
                defaultValue={(router.query.search as string) || ""}
                onSearch={(value) => {
                  router.push(`/shop?search=${value}`);
                }}
              />
            </Col>
            <Col
              span={lg ? 5 : 0}
              style={{
                display: !lg ? "none" : "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 10px",
              }}
            >
              <Badge
                count={wishlist.length > 0 ? wishlist?.length : 0}
                style={{fontSize: 12}}
              >
                <Link
                  href={
                    user ? "/my-profile?activeTab=my-wishlists" : "/auth/login"
                  }
                >
                  <Button
                    type="text"
                    size="large"
                    icon={<FiHeart size={26} />}
                  />
                </Link>
              </Badge>
              <Badge
                count={cart.length > 0 ? cart?.length : 0}
                style={{fontSize: 12}}
              >
                <Button
                  type="text"
                  size="large"
                  icon={<FiShoppingCart size={26} />}
                  onClick={() => {
                    if (!router.pathname.includes("/cart")) {
                      dispatch(setShowMiniCart());
                    }
                  }}
                />
              </Badge>
            </Col>
            <Col
              span={lg ? 11 : 24}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: lg ? "center" : "flex-end",
              }}
            >
              {user ? (
                <Dropdown menu={{items}} trigger={["click"]}>
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>
                      <Avatar
                        src={
                          user?.avatar ||
                          "https://static-00.iconduck.com/assets.00/avatar-default-symbolic-icon-512x512-0mhn1054.png"
                        }
                        size={"large"}
                      />
                      <Typography.Text style={{display: lg ? "block" : "none"}}>
                        Hello,{" "}
                        {user?.name.length > 15
                          ? user?.name.slice(0, 15) + "..."
                          : user?.name}
                      </Typography.Text>
                    </Space>
                  </a>
                </Dropdown>
              ) : (
                <Flex gap={10}>
                  <Link href={"/auth/login"}>
                    <Button
                      type="primary"
                      size="large"
                      style={{fontSize: 12, padding: `0 ${lg ? 26 : 16}px`}}
                    >
                      Login
                    </Button>
                  </Link>
                </Flex>
              )}
            </Col>
          </Row>
        </Col>
        <Col span={lg ? 1 : 0}></Col>
      </Row>
      <Drawer
        title={`Hello, ${user?.name}`}
        placement={"left"}
        onClose={() => setOpen(false)}
        open={open}
        key={"left"}
        closeIcon={<IoClose size={30} />}
        width={!lg ? "100%" : 0}
      >
        <Flex
          justify="center"
          align="center"
          gap={40}
          style={{marginBottom: 20}}
        >
          <div>
            {user ? (
              <Dropdown menu={{items}} trigger={["click"]}>
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    <Avatar
                      src={
                        user?.avatar ||
                        "https://static-00.iconduck.com/assets.00/avatar-default-symbolic-icon-512x512-0mhn1054.png"
                      }
                      size={"large"}
                    />
                  </Space>
                </a>
              </Dropdown>
            ) : (
              <Flex gap={10}>
                <Link href={"/auth/login"}>
                  <Button
                    type="primary"
                    size="large"
                    style={{fontSize: 12, padding: `0 ${lg ? 26 : 16}px`}}
                  >
                    Login
                  </Button>
                </Link>
              </Flex>
            )}
          </div>
          <Flex justify="end" align="center" gap={40}>
            <Badge
              count={wishlist.length > 0 ? wishlist?.length : 0}
              style={{fontSize: 12}}
            >
              <Link href={"/my-profile?activeTab=my-wishlists"}>
                <Button type="text" size="large" icon={<FiHeart size={26} />} />
              </Link>
            </Badge>
            <Badge
              count={cart.length > 0 ? cart?.length : 0}
              style={{fontSize: 12}}
            >
              <Link href="/cart">
                <Button
                  type="text"
                  size="large"
                  icon={<FiShoppingCart size={26} />}
                />
              </Link>
            </Badge>
          </Flex>
        </Flex>
        <Flex justify="center" align="center" style={{marginBottom: 30}}>
          <Input.Search
            placeholder="Search..."
            width={50}
            style={{display: "flex", alignItems: "center"}}
          />
        </Flex>
        <Menu
          selectedKeys={[currentPath]}
          items={[
            {
              label: <Link href="/">Home</Link>,
              key: "home",
            },
            {
              label: <Link href="/about-us">About Us</Link>,
              key: "about-us",
            },
            {
              label: "Blog",
              key: "blog",
            },
            {
              label: "Contact Us",
              key: "contact-us",
            },
          ]}
        />
        <Divider />
        <Link href="/shop">
          <Typography.Title level={5} style={{marginBottom: 20}}>
            Shop
          </Typography.Title>
        </Link>
        <Tree
          showLine
          switcherIcon={<FaCaretRight size={18} />}
          defaultExpandedKeys={["0-0-0"]}
          onSelect={(value) => {
            router.push(`/shop?categories=${value}`);
            setCheck(!check);
          }}
          treeData={categoriesCustom}
          style={{height: "100%"}}
        />
      </Drawer>
    </>
  );
};

export default HeaderCustom;
