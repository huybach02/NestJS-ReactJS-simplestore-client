import React from "react";

const SectionMain = ({
  children,
  space = 100,
}: {
  children: React.ReactNode;
  space?: number;
}) => {
  return <div style={{margin: `${space}px 0 ${space}px 0`}}>{children}</div>;
};

export default SectionMain;
