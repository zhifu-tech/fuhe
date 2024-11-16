import stores from '@/stores/index';
import { autorun } from 'mobx-miniprogram';
import { show as showCategoryPopup } from '../popup/popup';

Component({
  behaviors: [
    require('miniprogram-computed').behavior, //
    require('@/common/mobx/auto-disposers'),
    require('@/common/toast/simple'),
  ],
  options: {
    pureDataPattern: /^_/,
  },
  data: {
    list: [],
    indexList: [],
    stickyOffset: 0,
  },

  lifetimes: {
    attached: function () {
      this._calStickyOffset();
      this.addToAutoDisposable(
        autorun(() => {
          const categoryList = stores.category.categoryList;
          this._updateCategoryIndexList(categoryList);
        }),
      );
    },
  },
  methods: {
    handleGoBack: wx.navigateBack,
    handleAddCategory: function () {
      showCategoryPopup(this, {});
    },
    handleSelect: function (e) {
      const { categoryId } = e.target.dataset;
      this.getOpenerEventChannel().emit('pickedCategory', categoryId);
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
