module.exports = Behavior({
  data: {
    supplier: {
      picked: null,
    },
  },
  methods: {
    showSupplierPicker: function () {
      wx.navigateTo({
        url: '/package-goods/entity/list/index',
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
