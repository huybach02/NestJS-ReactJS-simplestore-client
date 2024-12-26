import {Grid, Typography} from "antd";
import React from "react";

const TitleMain = ({title}: {title: string}) => {
  const {lg} = Grid.useBreakpoint();
  return (
    <div>
      <Typography.Title
        level={lg ? 2 : 4}
        style={{fontWeight: "600", textAlign: "center", marginBottom: 40}}
      >
        {title}
      </Typography.Title>
    </div>
  );
};

export default TitleMain;
