const { default: services } = require('@/services/index');
const { default: pages } = require('@/common/page/pages');

Component({
  options: {
    pureDataPattern: /^_/,
  },
  data: {
    _tag: 'entity-list',
    _entityList: [],
    list: [],
    indexList: [],
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
      this.getOpenerEventChannel().emit('pickedEntity', entity);
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
      const { records: entityList } = await services.entity.all({ tag: this.data._tag });
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
        _entityList: entityList,
      });
    },
  },
});
