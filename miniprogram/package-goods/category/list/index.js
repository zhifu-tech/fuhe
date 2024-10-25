const { default: services } = require('@/services/index');
const { default: pages } = require('@/common/page/pages');

Component({
  options: {
    pureDataPattern: /^_/,
  },
  data: {
    _tag: 'category-list',
    _categoryList: [],
    list: [],
    indexList: [],
    stickyOffset: 0,
  },
  lifetimes: {
    attached: function () {
      this._calStickyOffset();
      this._fetchCategoryList();
    },
  },
  methods: {
    handleGoBack: function () {
      wx.navigateBack();
    },
    handleSelect: function (e) {
      const { category } = e.target.dataset;
      pages.currentPage().getOpenerEventChannel().emit('pickedCategory', category);
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
    _fetchCategoryList: async function () {
      const { records: categoryList } = await services.category.all({ tag: this.data._tag });
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
        _categoryList: categoryList,
      });
    },
  },
});
