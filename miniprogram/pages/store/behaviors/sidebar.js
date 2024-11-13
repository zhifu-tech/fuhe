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
      const { tag, categorySelected } = this.data;
      const { value: selected } = e.detail;
      if (selected === stores.category.categoryAdd._id) {
        // 解决状态错乱的问题，选中add时，重新选中之前的分类
        this.setData({ categorySelected });
        this._showCategoryPopup();
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
        this._showCategoryPopup();
      } else if (cId === stores.category.categoryAll._id) {
        services.category.switchSelectedCategory({
          tag,
          cId,
          trigger: 'sidebar-longpress',
        });
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
