/* eslint-disable @typescript-eslint/no-explicit-any */
import {DataNode} from "antd/es/tree";

export const handleTreeValueCustom = (
  data: any[],
  key: string,
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
          title: item.name,
          value: item._id,
          ...item,
        };

        if (children.length > 0) {
          return {...node, children};
        }

        return node;
      });
  };

  const result = buildTree(null);

  return result;
};

export const calculateTotalProducts = (category: any): number => {
  let total = category.productCount || 0;

  if (category.children && category.children.length > 0) {
    category.children.forEach((child: any) => {
      total += calculateTotalProducts(child);
    });
  }

  return total;
};

interface TreeNode {
  title: string;
  value: string;
  children?: TreeNode[];
}

const findCategoryPath = (
  categories: TreeNode[],
  targetId: string
): TreeNode[] => {
  for (const category of categories) {
    if (category.value === targetId) {
      return [category];
    }

    if (category.children) {
      const result = findCategoryPath(category.children, targetId);
      if (result.length > 0) {
        return [category, ...result];
      }
    }
  }
  return [];
};

export const createTreeCategoryByCurrentId = (
  categories: TreeNode[],
  currentId: string
): DataNode[] => {
  const pathCategories = findCategoryPath(categories, currentId);

  if (pathCategories.length === 0) return [];

  const result: DataNode = {
    title: pathCategories[0].title,
    key: pathCategories[0].value,
    children: [],
  };

  let currentNode = result;
  for (let i = 1; i < pathCategories.length; i++) {
    const newNode = {
      title: pathCategories[i].title,
      key: pathCategories[i].value,
      children: [],
    };
    currentNode.children = [newNode];
    currentNode = newNode;
  }

  return [result];
};
