/* eslint-disable @typescript-eslint/no-explicit-any */
import {Steps} from "antd";

export const StepOfOrder = ({order}: {order: any}) => {
  return (
    <Steps
      current={
        order?.orderStatus === "confirmed"
          ? 0
          : order?.orderStatus === "processing"
          ? 1
          : order?.orderStatus === "shipping"
          ? 2
          : order?.orderStatus === "completed"
          ? 3
          : order?.orderStatus === "cancelled"
          ? 4
          : 0
      }
      items={[
        {
          title: "Confirmed",
          description: null,
        },
        {
          title: "Processing",
          description: null,
        },
        {
          title: "Shipping",
          description: null,
        },
        {
          title: "Completed",
          description: null,
        },
        {
          title: "Cancelled",
          description: null,
        },
      ]}
      style={{margin: "20px 0"}}
    />
  );
};
