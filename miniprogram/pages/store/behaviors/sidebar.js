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
      const { value: selected } = e.detail;
      stores.category.selected = selected;
    },
    onSideBarItemLongPress: async function (e) {
      const { tag } = this.data;
      const { id: cId } = e.currentTarget.dataset;
      if (cId === stores.category.categoryAll._id) {
        stores.category.selected = cId;
      } else {
        this._showCategoryPopup({ cId });
      }
    },
    _showCategoryPopup: function (args = {}) {
      require('@/package-cso/category/popup/popup.js', (popup) => {
        popup.show(this, args);
      }, ({ mod, errMsg }) => {
        console.error(`path: ${mod}, ${errMsg}`);
      });
    },
  },
});
