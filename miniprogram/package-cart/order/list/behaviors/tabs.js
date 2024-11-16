module.exports = Behavior({
  data: {
    tabs: [
      {
        label: '全部',
        value: 'all',
      },
      {
        label: '待归档',
        value: 'unarchived',
      },
      {
        label: '已归档',
        value: 'archived',
      },
    ],
    activeIndex: 0,
    scrollLeft: 0,
  },
  methods: {
    handleTabClick(e) {
      const { index } = e.currentTarget.dataset;
      this.setData({
        activeIndex: index,
      });
    },
  },
});
