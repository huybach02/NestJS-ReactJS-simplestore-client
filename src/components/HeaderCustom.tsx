import {RootState} from "@/redux/store";
import {Avatar, Flex} from "antd";
import Link from "next/link";
import React from "react";
import {useSelector} from "react-redux";

const HeaderCustom = () => {
  const {user} = useSelector((state: RootState) => state.user);

  return (
    <>
      {user ? (
        <Avatar
          src={
            user?.avatar ||
            "https://static-00.iconduck.com/assets.00/avatar-default-symbolic-icon-512x512-0mhn1054.png"
          }
        />
      ) : (
        <Flex>
          <Link href={"/auth/login"}>Login</Link>
          <Link href={"/auth/register"}>Register</Link>
        </Flex>
      )}
    </>
  );
};

export default HeaderCustom;
