import {Flex} from "antd";
import {HashLoader} from "react-spinners";

const Loading = () => {
  return (
    <Flex justify="center" align="center" style={{height: "100vh"}}>
      <HashLoader color="#000" />
    </Flex>
  );
};

export default Loading;
