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
  categories: any[],
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

export const getMultipleChildrenCategories = (
  categories: any[],
  categoryIds: string[]
): string[] => {
  const result: string[] = [];
  const resultSlug: string[] = [];

  categoryIds.forEach((categoryId) => {
    getChildrenCategory(categories, categoryId, result);
  });

  result.forEach((element) => {
    for (const item of categories) {
      if (item._id === element) {
        resultSlug.push(item.slug);
      }
    }
  });

  return resultSlug;
};

export const getChildrenCategory = (
  categories: any[],
  currentId: string,
  data: string[] = []
): string[] => {
  if (!data.includes(currentId)) {
    data.push(currentId);
  }

  const childCategories = categories.filter(
    (category) => category.parentId === currentId
  );

  childCategories.forEach((child) => {
    getChildrenCategory(categories, child._id, data);
  });

  return data;
};

export const getChildrenCategorySlug = (
  categories: any[],
  currentSlug: string,
  data: string[] = []
): string[] => {
  const currentId = categories.find(
    (category) => category.slug === currentSlug
  )?._id;

  if (!data.includes(currentId)) {
    data.push(currentId);
  }

  const childCategories = categories.filter(
    (category) => category.parentId === currentId
  );

  childCategories.forEach((child) => {
    getChildrenCategorySlug(categories, child.slug, data);
  });

  return data;
};

export const getCategoryIdBySlug = (
  categories: any[],
  slug: string
): string | null => {
  for (const category of categories) {
    if (category.slug === slug) {
      return category._id;
    }

    if (category.children) {
      const result = getCategoryIdBySlug(category.children, slug);
      if (result) {
        return result;
      }
    }
  }
  return null;
};

export const getParentKeys = (key: string, tree: any[]): string[] => {
  const parentKeys: string[] = [];
  const findParent = (nodes: any[]) => {
    for (const node of nodes) {
      if (node.children?.some((child: any) => child.slug === key)) {
        parentKeys.push(node._id);
        findParent(node.children);
      }
    }
  };
  findParent(tree);
  return parentKeys;
};
