module.exports = Behavior({
  data: {
    showSpecList: false, // 是否展示规格列表
  },
  methods: {
    handleShowSpecList: function () {
      const showSpecList = !this.data.showSpecList;
      if (showSpecList) {
        this.setData({
          showSpecList: true,
        });
      }
    },
  },
});
