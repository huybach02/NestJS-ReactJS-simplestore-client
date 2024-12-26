/* eslint-disable @typescript-eslint/no-explicit-any */
import useTreeValue from "@/hooks/useTreeValue";
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

  const {lg} = Grid.useBreakpoint();

  const {user} = useSelector((state: RootState) => state.user);
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
        <Link href="/" rel="noopener noreferrer">
          Profile
        </Link>
      ),
      key: "2",
    },
    {
      label: (
        <Link href="/" rel="noopener noreferrer">
          Dashboard
        </Link>
      ),
      key: "3",
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
      key: "4",
      onClick: async () => {
        await authService.logout();
        dispatch(removeUser());
        router.push("/");
      },
    },
  ];

  const fetchCategories = async () => {
    const res = await baseService.findAll("categories", 1, 99999, {
      active: true,
    });
    setCategories(handleTreeValue(res.data, "parentId"));
    setCategoriesCustom(handleTreeValueCustom(res.data, "parentId"));
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
              {
                label: "Blog",
                key: "blog",
              },
              {
                label: "Contact Us",
                key: "contact-us",
              },
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
              <Badge count={5} style={{fontSize: 12}}>
                <Button type="text" size="large" icon={<FiHeart size={26} />} />
              </Badge>
              <Badge count={5} style={{fontSize: 12}}>
                <Button
                  type="text"
                  size="large"
                  icon={<FiShoppingCart size={26} />}
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
        title=""
        placement={"left"}
        onClose={() => setOpen(false)}
        open={open}
        key={"left"}
        closeIcon={<IoClose size={30} />}
        width={!lg ? "100%" : 0}
      >
        <Menu
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
        <Typography.Title level={5} style={{marginBottom: 20}}>
          Shop
        </Typography.Title>
        <Tree
          showLine
          switcherIcon={<FaCaretRight size={18} />}
          defaultExpandedKeys={["0-0-0"]}
          onSelect={(value) => {
            router.push(`/shop?category=${value}`);
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
