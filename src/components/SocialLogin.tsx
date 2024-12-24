import {Button} from "antd";
import {FcGoogle} from "react-icons/fc";
import {GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import {firebaseAuth} from "@/config/firebase";
import {useDispatch} from "react-redux";
import {useState} from "react";
import {authService} from "@/service/authService";
import {setUser} from "@/redux/slice/userSlice";
import {useRouter} from "next/router";

const provider = new GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
provider.setCustomParameters({
  login_hint: "user@gmail.com",
});

const SocialLogin = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const response = await signInWithPopup(firebaseAuth, provider);

      if (response.user) {
        const googleLoginData = {
          name: response.user.displayName,
          email: response.user.email,
          avatar: response.user.photoURL,
          accountType: "google",
        };
        const res = await authService.socialLogin(googleLoginData);
        if (res?.success) {
          dispatch(setUser(res?.data));
          router.push("/");
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        size="large"
        type="default"
        block
        onClick={handleLogin}
        loading={isLoading}
      >
        <FcGoogle />
        Login with Google
      </Button>
    </>
  );
};

export default SocialLogin;
