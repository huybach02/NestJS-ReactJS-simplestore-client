/* eslint-disable @typescript-eslint/no-explicit-any */
import {TableRowSelection} from "antd/es/table/interface";
import React, {useState} from "react";

const useSelection = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<any> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return {
    rowSelection,
    onSelectChange,
    selectedRowKeys,
  };
};

export default useSelection;
