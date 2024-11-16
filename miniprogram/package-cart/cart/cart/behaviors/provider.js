import stores from '@/stores/index';

module.exports = Behavior({
  data: {
    providerId: '',
    providerName: '',
  },
  methods: {
    showProviderPicker: function () {
      wx.navigateTo({
        url: `/package-mix/entity/list/index?title='选择卖方'`,
        events: {
          pickedEntity: (entityId) => {
            if (entityId !== this.data.providerId) {
              const entity = stores.entity.getEntity(entityId);
              this.setData({
                providerId: entityId,
                providerName: entity.name,
              });
            }
          },
        },
      });
    },
  },
});
