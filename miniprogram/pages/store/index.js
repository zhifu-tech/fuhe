Page({
  root: function () {
    return this.selectComponent('#store');
  },
  onShow() {
    this.getTabBar().init();
  },
});
