/* eslint-disable @typescript-eslint/no-explicit-any */
import {CategoryType} from "@/types/categoryType";
import {SupplierType} from "@/types/supplierType";
import {debounce} from "@/utils/debounce";
import {formatMoney} from "@/utils/formatMoney";
import {getCategoryIdBySlug, getParentKeys} from "@/utils/handleTreeValue";
import {DownOutlined} from "@ant-design/icons";
import {Checkbox, Divider, Flex, Grid, Slider, Tree, Typography} from "antd";
import {useRouter} from "next/router";
import React, {Key, useMemo, useState} from "react";

const ProductFilter = ({
  categories,
  suppliers,
  filter,
  setFilter,
  maxPrice,
}: {
  categories: CategoryType[];
  suppliers: SupplierType[];
  filter: any;
  setFilter: (filter: any) => void;
  maxPrice: number;
}) => {
  const router = useRouter();

  const {lg} = Grid.useBreakpoint();

  const [expandedKeys, setExpandedKeys] = useState<Key[]>(
    router.query.categories
      ? getParentKeys(router.query.categories as string, categories)
      : []
  );
  const [localPrice, setLocalPrice] = useState<number[]>(
    filter?.price || [0, maxPrice]
  );

  const categoryIdSelected = getCategoryIdBySlug(
    categories,
    router.query.categories as string
  );

  const [selectedKeys, setSelectedKeys] = useState<Key[]>(
    categoryIdSelected ? [categoryIdSelected] : []
  );

  const debouncedSetFilter = useMemo(
    () =>
      debounce((value: number[]) => {
        setFilter((prev: any) => ({
          ...prev,
          price: value,
        }));
      }, 500),
    []
  );

  return (
    <div style={{width: "100%"}}>
      <Flex vertical gap={10}>
        <Typography.Title level={5}>Filter by category</Typography.Title>
        <Tree
          // multiple
          switcherIcon={<DownOutlined />}
          treeData={categories.map((category) => ({
            key: category._id,
            title: category.name,
            ...category,
          }))}
          expandedKeys={expandedKeys}
          onExpand={(newExpandedKeys) => {
            setExpandedKeys(newExpandedKeys);
          }}
          selectedKeys={selectedKeys}
          onSelect={(selectedKeys: Key[]) => {
            setSelectedKeys(selectedKeys);
            setFilter((prev: any) => ({
              ...prev,
              categories:
                selectedKeys.length > 0
                  ? selectedKeys.map((key) => key.toString())
                  : [],
            }));
          }}
        />
      </Flex>
      <Divider />
      <Flex vertical gap={10} style={{width: lg ? "80%" : "100%"}}>
        <Typography.Title level={5}>Filter by price</Typography.Title>
        <Slider
          range={{draggableTrack: true}}
          value={localPrice}
          max={maxPrice}
          min={0}
          onChange={(value: number[]) => {
            setLocalPrice(value);
            debouncedSetFilter(value);
          }}
        />
        <Flex justify="space-between">
          <Typography.Text>Min: {formatMoney(localPrice[0])}</Typography.Text>
          <Typography.Text>
            Max: {formatMoney(localPrice[1] || maxPrice)}
          </Typography.Text>
        </Flex>
      </Flex>
      <Divider />
      <Flex vertical gap={10}>
        <Typography.Title level={5}>Filter by supplier</Typography.Title>
        <Flex vertical gap={10}>
          {suppliers.map((supplier) => (
            <Checkbox
              key={supplier._id}
              value={supplier._id}
              checked={filter?.suppliers.includes(supplier.slug)}
              onChange={(e) => {
                setFilter((prev: any) => ({
                  ...prev,
                  suppliers: e.target.checked
                    ? [...prev.suppliers, supplier.slug]
                    : prev.suppliers.filter(
                        (slug: string) => slug !== supplier.slug
                      ),
                }));
              }}
            >
              {supplier.name}
            </Checkbox>
          ))}
        </Flex>
      </Flex>
    </div>
  );
};

export default ProductFilter;
