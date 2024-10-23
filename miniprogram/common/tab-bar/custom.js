module.exports = Behavior({
  pageLifetimes: {
    show: function () {
      this.getTabBar().init();
    },
  },
});
