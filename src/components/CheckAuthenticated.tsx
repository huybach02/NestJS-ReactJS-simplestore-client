import {RootState} from "@/redux/store";
import {useRouter} from "next/router";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
const CheckAuthenticated = (WrappedComponent: React.ComponentType<any>) => {
  const AuthenticatedComponent = () => {
    const router = useRouter();
    const {user} = useSelector((state: RootState) => state.user);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
      if (user) {
        router.push("/");
      } else {
        setIsChecking(false);
      }
    }, [user, router]);

    if (isChecking) {
      return null; // hoặc return <LoadingComponent /> nếu bạn muốn hiển thị loading
    }

    return <WrappedComponent />;
  };

  return AuthenticatedComponent;
};

export default CheckAuthenticated;
