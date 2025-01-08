/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from "next/link";

const useTreeValue = () => {
  const handleTreeValue = (
    data: any[],
    key: string = "parentId",
    isUseId: boolean = false
  ) => {
    const buildTree = (parentId: string | null = null): any[] => {
      return data
        .filter((item) =>
          parentId === null ? !item[key] : item[key] === parentId
        )
        .map((item) => {
          const children = buildTree(item._id);
          const node = {
            key: isUseId ? item._id : item.slug,
            label: (
              <Link href={`/shop?categories=${item.slug}`}>{item.name}</Link>
            ),
          };

          if (children.length > 0) {
            return {
              ...node,
              children,
            };
          }

          return node;
        });
    };

    const result = buildTree(null);

    return result;
  };

  return {
    handleTreeValue,
  };
};

export default useTreeValue;
