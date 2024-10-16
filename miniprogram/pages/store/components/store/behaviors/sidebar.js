import services from '../../../../../services/index';
import log from '../../../../../common/log/log';

module.exports = Behavior({
  data: {
    showSideBar: true,
    foldBtnProps: {
      theme: 'default',
      size: 'large',
      variant: 'text',
    },
  },
  lifetimes: {
    attached: function () {
      const prefs = wx.getStorageSync('store.showSideBar');
      if (prefs !== '') {
        this.setData({
          showSideBar: prefs,
        });
      }
    },
  },
  methods: {
    handleSideBarFold: function () {
      const showSideBar = !this.data.showSideBar;
      this.setData({ showSideBar });
      wx.setStorageSync('store.showSideBar', showSideBar);
    },
    onSideBarChange: function (e) {
      const { saasId } = this.data;
      const { value: selected } = e.detail;
      if (selected === services.category.addCategoryId) {
        this.showCategoryPopup({ saasId });
      } else {
        this.setData({
          'category.selected': selected,
        });
      }
    },
    onSideBarItemLongPress: async function (e) {
      const { tag, saasId } = this.data;
      const { id: cId } = e.currentTarget.dataset;
      if (cId === services.category.allCategoryId) {
        log.info(tag, 'all category is not support long press');
      } else {
        const args = { saasId };
        try {
          const [categoryRes, specsRes] = await Promise.all([
            services.category.crud.get({ tag, saasId, id: cId }),
            services.spec.list({ tag, saasId, cId }),
          ]);
          args.category = categoryRes;
          args.specs = specsRes.records;
        } catch (error) {
          log.error(tag, 'showPopup', error);
          return;
        }
        this.showCategoryPopup(args);
        log.info(tag, 'onCategoryLongPressed', e);
      }
    },
  },
});
