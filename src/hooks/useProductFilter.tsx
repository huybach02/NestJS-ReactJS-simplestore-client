import {ProductType} from "@/types/productType";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {getSortedProducts} from "@/utils/sortProduct";
import {getChildrenCategorySlug} from "@/utils/handleTreeValue";
import {CategoryType} from "@/types/categoryType";
import {filterByPrice} from "@/utils/filterProduct";
import {SupplierType} from "@/types/supplierType";

export const useProductFilter = (
  products: ProductType[],
  categories: CategoryType[],
  suppliers: SupplierType[],
  setIsDrawerOpen: (value: boolean) => void
) => {
  const router = useRouter();

  const ITEMS_PER_PAGE = 16;

  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
  const [total, setTotal] = useState(products.length);

  useEffect(() => {
    const skip = (Number(router.query.page || 1) - 1) * ITEMS_PER_PAGE;
    const limit = skip + ITEMS_PER_PAGE;

    let result = [...products];

    if (router.query.sortBy) {
      result = getSortedProducts(result, router.query.sortBy as string);
    }

    if (router.query.categories) {
      const categoryIds = getChildrenCategorySlug(
        categories,
        router.query.categories as string
      );
      result = result.filter((product) =>
        categoryIds.includes(product.category._id)
      );
    }

    if (router.query.price) {
      const [minPrice, maxPrice] = (router.query.price as string)
        .split("-")
        .map(Number);
      result = filterByPrice(result, minPrice, maxPrice);
    }

    if (router.query.suppliers) {
      const supplierSlugs = (router.query.suppliers as string).split(",");
      const supplierIds = supplierSlugs.map(
        (slug) => suppliers.find((supplier) => supplier.slug === slug)?._id
      );
      result = result.filter((product) =>
        supplierIds.includes(product.supplier._id)
      );
    }

    if (router.query.search) {
      const searchValue = router.query.search as string;
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    setTotal(result.length);

    result = result.slice(skip, limit);

    setFilteredProducts(result);
    setIsDrawerOpen(false);
  }, [
    products,
    router.query.page,
    router.query.sortBy,
    router.query.categories,
    router.query.price,
    router.query.suppliers,
  ]);

  return {
    ITEMS_PER_PAGE,
    productsData: filteredProducts,
    total,
  };
};
