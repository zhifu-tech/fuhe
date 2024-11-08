import log from '@/common/log/log';
import stores from '@/stores/index';
import services from '@/services/index';

module.exports = Behavior({
  data: {
    showSideBar: true,
  },
  lifetimes: {
    attached: function () {
      const prefs = wx.getStorageSync('stores.showSideBar');
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
      wx.setStorageSync('stores.showSideBar', showSideBar);
    },
    onSideBarChange: function (e) {
      const { tag } = this.data;
      const { value: selected } = e.detail;
      if (selected === stores.category.categoryAdd._id) {
        require('@/package-cso/category/popup/popup.js', (popup) => {
          popup.show(this, {});
        }, ({ mod, errMsg }) => {
          console.error(`path: ${mod}, ${errMsg}`);
        });
      } else {
        services.category.switchSelectedCategory({
          tag,
          cId: selected,
          trigger: 'sidebar-change',
        });
      }
    },
    onSideBarItemLongPress: async function (e) {
      const { tag } = this.data;
      const { id: cId } = e.currentTarget.dataset;
      if (cId === stores.category.categoryAdd._id) {
        require('@/package-cso/category/popup/popup.js', (popup) => {
          popup.show(this, {});
        }, ({ mod, errMsg }) => {
          console.error(`path: ${mod}, ${errMsg}`);
        });
      } else if (cId === stores.category.categoryAll._id) {
        services.category.switchSelectedCategory({
          tag,
          cId,
          trigger: 'sidebar-longpress',
        });
      } else {
        require('@/package-cso/category/popup/popup.js', (popup) => {
          popup.show(this, { cId });
        }, ({ mod, errMsg }) => {
          console.error(`path: ${mod}, ${errMsg}`);
        });
      }
    },
  },
});
