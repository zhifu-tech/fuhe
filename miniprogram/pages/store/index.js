import fetchStoreCategoryListData from '../../services/store/fetchStoreCategoryListData';
import fetchStoreSpecListData from '../../services/store/fetchStoreSpecsListData';
import fetchStoreGoodsListData from '../../services/store/fetchStoreGoodsListData';
import log from '../../utils/log';
import storeCategory, { allCategoryId } from './data/storeCategory';
import storeGoods from './data/storeGoods';
import storeSpec, { allSpecId } from './data/storeSpec';

Page({
  data: {
    tag: 'pageStore',
    category: {
      selected: '',
      items: [],
    },
    storeCategory: null,
    spec: {
      selected: '',
      items: [],
    },
    storeSpec: null,
    goods: {
      items: [],
    },
    storeGoods: null,
    stocks: {
      items: [],
    },
    loadMoreStatus: 0, // 0: idle, 1: loading, 2: loaded, 3: error
  },

  onLoad(options) {
    this.initData();
    this.init();
  },

  onReady() {},

  onShow() {},

  onHide() {},

  onUnload() {},

  onPullDownRefresh() {},

  onReachBottom() {
    const { tag } = this.data;
    log.info(tag, 'onReacBottom and try to load more!');
    this.loadMore();
  },

  onShareAppMessage() {},

  onScroll() {},

  onCategorySelectedChange(e) {
    const { tag, category } = this.data;
    const { value: selectedCategory, label } = e.detail;
    if (selectedCategory === '0') {
      wx.showToast({
        title: '新增分类',
      });
      log.info(tag, 'add new category');
    } else if (selectedCategory === category.selected) {
      log.info(tag, `duplicate selected ${label} do nothing`);
    } else {
      log.info(tag, `selected to category ${label}`);
      this.loadWithCategoryChange(selectedCategory);
    }
  },
  onSpecSelectedChange(e) {
    const { tag, spec } = this.data;
    const { value: selectedSpec, label } = e.detail;
    log.info(tag, 'onSpecSelectedChange', selectedSpec);
    if (selectedSpec === '0') {
      wx.showToast({
        title: '新增规格',
      });
      log.info(tag, 'add new spec');
    } else if (selectedSpec == spec.selected) {
      log.info(tag, `duplicate selected ${label} do nothing`);
    } else {
      log.info(tag, `selected to spec ${label}`);
      this.loadWithSpecChange(selectedSpec);
    }
  },

  initData: function () {
    if (this.data.storeCategory === null) {
      this.data.storeCategory = storeCategory();
    }
    if (this.data.storeSpec === null) {
      this.data.storeSpec = storeSpec();
    }
    if (this.data.storeGoods === null) {
      this.data.storeGoods = storeGoods();
    }
  },
  init: async function (reset = true) {
    const { tag, loadMoreStatus, storeCategory, storeSpec, storeGoods } = this.data;
    if (loadMoreStatus === 1) {
      log.info(tag, 'init', 'Last init is not finished, do nothing!');
      return;
    }
    this.setData({ loadMoreStatus: 1 });

    try {
      const [updatedCategory, updatedSpec, updatedGoods] = await Promise.all([
        fetchStoreCategoryListData(storeCategory),
        fetchStoreSpecListData(storeCategory, storeSpec, allCategoryId()),
        fetchStoreGoodsListData(storeCategory, storeSpec, storeGoods, allCategoryId(), allSpecId()),
      ]);
      this.setData({
        'category.items': updatedCategory.items,
        'category.selected': updatedCategory.selected,
        'spec.items': updatedSpec.items,
        'spec.selected': updatedSpec.selected,
        'goods.items': updatedGoods.items,
        loadMoreStatus: 2,
      });
    } catch (e) {
      log.error(tag, e);
      this.setData({
        loadMoreStatus: 3,
      });
    }
  },
  loadWithCategoryChange: async function (selectedCategory) {
    const { tag, loadMoreStatus, storeCategory, storeSpec, storeGoods } = this.data;
    if (loadMoreStatus === 1) {
      log.info(tag, 'loadWithCategoryChange', 'Last load is not finished!');
      return;
    }
    this.setData({ loadMoreStatus: 1 });
    try {
      const updatedSpec = await fetchStoreSpecListData(storeCategory, storeSpec, selectedCategory);
      const updatedGoods = await fetchStoreGoodsListData(
        storeCategory,
        storeSpec,
        storeGoods,
        selectedCategory,
        updatedSpec.selected,
      );
      log.info(tag, 'upda', updatedSpec.selected);
      this.setData({
        'category.selected': selectedCategory,
        'spec.items': updatedSpec.items,
        'spec.selected': updatedSpec.selected,
        'goods.items': updatedGoods.items,
        loadMoreStatus: 2,
      });
    } catch (e) {
      log.error(tag, e);
      this.setData({
        loadMoreStatus: 3,
      });
    }
  },
  loadWithSpecChange: async function (selectedSpec) {
    const { tag, loadMoreStatus, category, storeCategory, storeSpec, storeGoods } = this.data;
    if (loadMoreStatus === 1) {
      log.info(tag, 'loadWithSpecChange', 'Last load is not finished!');
      return;
    }
    this.setData({ loadMoreStatus: 1 });
    try {
      const upatedGoods = await fetchStoreGoodsListData(
        storeCategory,
        storeSpec,
        storeGoods,
        category.selected,
        selectedSpec,
      );
      storeSpec.updateSpecSelected(category.selected, selectedSpec);
      this.setData({
        'spec.selected': selectedSpec,
        'goods.items': upatedGoods.items,
        loadMoreStatus: 2,
      });
    } catch (e) {
      log.error(tag, e);
      this.setData({
        loadMoreStatus: 3,
      });
    }
  },
  loadMore: function () {
    const { tag, loadMoreStatus, category, spec, storeCategory, storeGoods } = this.data;
    if (loadMoreStatus == 2) {
      log.info(tag, 'loadMore, already show no more!');
      return;
    }
    if (loadMoreStatus === 1) {
      log.info(tag, 'loadWithSpecChange', 'Last load is not finished!');
      return;
    }
    if (!storeGoods.checkHasMore(category.selected, spec.selected)) {
      log.info(tag);
    }
    const { total, items } = category.se;
    this.setData({ loadMoreStatus: 1 });
  },
});
