import log from '@/common/log/log';
import store from '@/stores/store';

module.exports = Behavior({
  data: {
    showSideBar: true,
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
      const { tag } = this.data;
      const { value: selected } = e.detail;
      if (selected === store.category.categoryAdd._id) {
        require('@/package-goods/category/popup/popup.js', (popup) => {
          popup.show(this, {});
        }, ({ mod, errMsg }) => {
          console.error(`path: ${mod}, ${errMsg}`);
        });
      } else {
        store.category.switchSelectedCategory({
          tag,
          cId: selected,
        });
      }
    },
    onSideBarItemLongPress: async function (e) {
      const { tag } = this.data;
      const { id: cId } = e.currentTarget.dataset;
      if (cId === store.category.categoryAdd._id) {
        require('@/package-goods/category/popup/popup.js', (popup) => {
          popup.show(this, {});
        }, ({ mod, errMsg }) => {
          console.error(`path: ${mod}, ${errMsg}`);
        });
      } else if (cId === store.category.categoryAll._id) {
        store.category.switchSelectedCategory({
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
