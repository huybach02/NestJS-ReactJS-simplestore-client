/* eslint-disable @typescript-eslint/no-explicit-any */
import {Avatar, Flex, Grid, Typography} from "antd";
import {FaImage} from "react-icons/fa";
import ImageUploadButton from "./ImageUploadButton";

type Props = {
  title: string;
  photoUrl: string | undefined;
  setPhotoUrl: any;
};

const UploadSingleImage = ({
  title = "Avatar",
  photoUrl,
  setPhotoUrl,
}: Props) => {
  const {lg} = Grid.useBreakpoint();

  return (
    <Flex vertical={!lg} align="center" gap={16}>
      <Typography.Text style={{fontWeight: "600"}}>{title}</Typography.Text>
      {photoUrl ? (
        <Avatar size={100} src={photoUrl} shape="square" />
      ) : (
        <Avatar size={100} shape="square">
          <FaImage size={lg ? 50 : 30} />
        </Avatar>
      )}
      <label htmlFor="photoUrl">
        <ImageUploadButton setImage={setPhotoUrl} />
      </label>
    </Flex>
  );
};

export default UploadSingleImage;
