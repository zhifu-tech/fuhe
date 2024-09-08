import log from '../../../utils/log';

export default function () {
  let data = null;
  return {
    reset: () => {
      data = null;
    },
    getCategory: function (id) {
      return data?.categories?.find((category) => category._id === id);
    },
    setCategoryData: function (newData) {
      data = newData;
    },
    getCategoryData: () => data,
  };
}

export function toCategoryItems(list) {
  const items = list.map((category) => ({
    label: category.name,
    value: category._id,
    badgeProps: {},
  }));
  if (items.length > 1) {
    items.unshift({
      label: '所有分类',
      value: allCategoryId(),
      badgeProps: {},
    });
  }
  items.push({
    label: '新增分类',
    value: '0',
    badgeProps: {},
  });
  return items;
}

export function allCategoryId() {
  return '1';
}

export function isAllCategory(categoryId) {
  return categoryId === allCategoryId();
}

export function emptySpecData() {
  return {
    items: toSpecItems([]),
    total: 0,
    pageNumber: 0,
    specs: [],
  };
}
