Component({
  options: {
    virtualHost: true,
  },
  behaviors: [
    require('../../../../common/toast/toasts'),
    require('./header/header'),
    require('./goods/goods'),
  ],
  data: {
    tag: 'goods-popup',
    visible: false,
    hasChanged: false,
  },
  methods: {
    showAddGoods: function () {
      this.setData({
        visible: true,
        goods: {},
        goodsInit: {},
      });
    },
    hidePopup() {
      const { hasChanged } = this.data;
      this.triggerEvent('close', {
        hasChanged,
      });
      this.setData({
        visible: false,
        hasChanged: false,
      });
    },
  },
});
