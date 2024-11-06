import stores from '@/stores/index';

Component({
  behaviors: [
    require('mobx-miniprogram-bindings').storeBindingsBehavior,
    require('miniprogram-computed').behavior,
  ],
  options: {
    pureDataPattern: /^_/,
  },
  data: {
    _tag: 'category-list',
    list: [],
    indexList: [],
    stickyOffset: 0,
  },
  storeBindings: {
    stores,
    fields: {
      categoryList: () => stores.category.categoryList,
    },
  },
  lifetimes: {
    attached: function () {
      this._calStickyOffset();
    },
  },
  watch: {
    categoryList: function (categoryList) {
      this._updateCategoryIndexList(categoryList);
    },
  },
  methods: {
    handleGoBack: function () {
      wx.navigateBack();
    },
    handleSelect: function (e) {
      const { category } = e.target.dataset;
      this.getOpenerEventChannel().emit('pickedCategory', category);
      wx.navigateBack();
    },
    _calStickyOffset: function () {
      const query = wx.createSelectorQuery();
      query.select('.custom-navbar').boundingClientRect();
      query.exec((res) => {
        const { height = 0 } = res[0] || {};
        this.setData({ stickyOffset: height });
      });
    },
    _updateCategoryIndexList: async function (categoryList) {
      const indexList = [];
      const list = [];
      let lastList = [];
      let lastLetter = '';
      categoryList.forEach((category) => {
        const letter = category.camel[0];
        if (letter !== lastLetter) {
          indexList.push(letter);
          lastList = [];
          lastLetter = letter;
          list.push({
            index: letter,
            children: lastList,
          });
        }
        lastList.push(category);
      });
      this.setData({
        list,
        indexList,
      });
    },
  },
});
