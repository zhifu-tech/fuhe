const { default: log } = require('@/common/log/log');
const { default: pages } = require('@/common/page/pages');

module.exports = Behavior({
  data: {
    supplier: {
      picked: null,
    },
  },
  methods: {
    showSupplierPicker: function () {
      wx.navigateTo({
        url: '/package-entity/pages/list/index',
        events: {
          pickedEntity: (entity) => {
            this.setData({
              'supplier.picked': entity,
            });
          },
        },
      });
    },
  },
});
