const { default: log } = require('@/common/log/log');
const { default: services } = require('@/services/index');
const { default: pages } = require('@/common/page/pages');

Component({
  options: {
    pureDataPattern: /^_/,
  },
  data: {
    tag: 'entity-list',
    list: [],
    indexList: [],
    entityList: [],
    stickyOffset: 0,
  },
  lifetimes: {
    attached: function () {
      this._calStickyOffset();
      this._fetchEntityList();
    },
  },
  methods: {
    handleGoBack: function () {
      wx.navigateBack();
    },
    handleSelect: function (e) {
      const { entity } = e.target.dataset;
      pages.currentPage().getOpenerEventChannel().emit('pickedEntity', entity);
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
    _fetchEntityList: async function () {
      const { records: entityList, total } = await services.entity.all({ tag: this.data.tag });
      const indexList = [];
      const list = [];
      let lastList = [];
      let lastLetter = '';
      entityList.forEach((entity) => {
        const letter = entity.camel[0];
        if (letter !== lastLetter) {
          indexList.push(letter);
          lastList = [];
          lastLetter = letter;
          list.push({
            index: letter,
            children: lastList,
          });
        }
        lastList.push(entity);
      });
      this.setData({
        list,
        indexList,
        entityList,
      });
    },
  },
});
