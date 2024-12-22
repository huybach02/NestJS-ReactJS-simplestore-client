/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@ant-design",
    "antd",
    "rc-util",
    "rc-pagination",
    "rc-picker",
    "rc-input",
    "rc-table",
    "rc-tree",
    "rc-drawer",
    "rc-dialog",
    "rc-select",
    "rc-cascader",
    "rc-checkbox",
    "rc-dropdown",
    "rc-menu",
    "rc-notification",
    "rc-tooltip",
    "rc-tree-select",
    "@rc-component",
  ],
  images: {
    remotePatterns: [
      // {
      //   protocol: "https",
      //   hostname: "simplestore-admin.vercel.app",
      // },
    ],
  },
};

module.exports = nextConfig;
