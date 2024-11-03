import log from '@/common/log/log';
import stores from '@/stores/index';

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
        require('@/package-goods/category/popup/popup.js', (popup) => {
          popup.show(this, {});
        }, ({ mod, errMsg }) => {
          console.error(`path: ${mod}, ${errMsg}`);
        });
      } else {
        stores.category.switchSelectedCategory({
          tag,
          cId: selected,
        });
      }
    },
    onSideBarItemLongPress: async function (e) {
      const { tag } = this.data;
      const { id: cId } = e.currentTarget.dataset;
      if (cId === stores.category.categoryAdd._id) {
        require('@/package-goods/category/popup/popup.js', (popup) => {
          popup.show(this, {});
        }, ({ mod, errMsg }) => {
          console.error(`path: ${mod}, ${errMsg}`);
        });
      } else if (cId === stores.category.categoryAll._id) {
        stores.category.switchSelectedCategory({
          tag,
          cId,
        });
      } else {
        require('@/package-goods/category/popup/popup.js', (popup) => {
          popup.show(this, { cId });
        }, ({ mod, errMsg }) => {
          console.error(`path: ${mod}, ${errMsg}`);
        });
      }
    },
  },
});
