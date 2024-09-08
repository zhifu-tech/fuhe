import log from '../../../../../utils/log';

module.exports = Behavior({
  data: {
    showCategoryInput: true, // 是否展示分类输入
  },
  methods: {
    onCategoryIconEditClick: function (e) {
      this.setData({
        showCategoryInput: !this.data.showCategoryInput,
      });
    },
    hideCategoryInput() {
      this.setData({
        showCategoryInput: false,
      });
    },
  },
});
