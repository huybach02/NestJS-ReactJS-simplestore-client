export type StatisticData = {
  key: string;
  description: string;
  value: number;
  icon: React.ReactNode;
  valueType: "currency" | "number";
  type?: "horizontal" | "vertical";
};
