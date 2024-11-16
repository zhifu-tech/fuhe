import stores from '@/stores/index';

module.exports = Behavior({
  data: {
    customerId: '',
    customerName: '',
  },
  methods: {
    showCustomerPicker: function () {
      wx.navigateTo({
        url: `/package-mix/entity/list/index?title='选择客户'`,
        events: {
          pickedEntity: (entityId) => {
            if (entityId !== this.data.customerId) {
              const entity = stores.entity.getEntity(entityId);
              this.setData({
                customerId: entityId,
                customerName: entity.name,
              });
            }
          },
        },
      });
    },
  },
});
