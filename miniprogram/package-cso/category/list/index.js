import stores from '@/stores/index';

Component({
  behaviors: [require('miniprogram-computed').behavior],
  options: {
    pureDataPattern: /^_/,
  },
  data: {
    _tag: 'category-list',
    list: [],
    indexList: [],
    stickyOffset: 0,
  },

  lifetimes: {
    attached: function () {
      this._calStickyOffset();
      this.disposers = [
        autorun(() => {
          const categoryList = stores.category.categoryList;
          this._updateCategoryIndexList(categoryList);
        }),
      ];
    },
    detached: function () {
      this.disposers.forEach((disposer) => disposer());
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
