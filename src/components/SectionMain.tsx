import React from "react";

const SectionMain = ({
  children,
  space = 100,
  style,
}: {
  children: React.ReactNode;
  space?: number;
  style?: React.CSSProperties;
}) => {
  return (
    <div style={{margin: `${space}px 0 ${space}px 0`, ...style}}>
      {children}
    </div>
  );
};

export default SectionMain;
