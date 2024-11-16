import stores from '@/stores/index';

module.exports = Behavior({
  data: {
    userId: '',
    userName: '',
  },
  methods: {
    showUserPicker: function () {
      wx.navigateTo({
        url: `/package-mix/entity/list/index?title='选择下单人'`,
        events: {
          pickedEntity: (entityId) => {
            if (entityId !== this.data.userId) {
              const entity = stores.entity.getEntity(entityId);
              this.setData({
                userId: entityId,
                userName: entity.name,
              });
            }
          },
        },
      });
    },
  },
});
