import log from '../../../../../utils/log';

module.exports = Behavior({
  behaviors: [require('../../../../../common/popup/popup-header')],
  observers: {
    'goods.title': function () {
      const title = '新增商品';
      if (title !== this.data.title) {
        this.setData({
          title,
        });
      }
    },
  },
  methods: {
    onConfirmClick: async function () {
      this.hidePopup();
      this.hideToast();
    },
  },
});
