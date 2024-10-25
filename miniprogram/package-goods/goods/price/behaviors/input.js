const { default: log } = require('@/common/log/log');

module.exports = Behavior({
  data: {
    showInput: false,
  },
  methods: {
    handlePriceClick: function () {
      if (!this.data.input) return;
      if (!this.data.showInput) {
        this.setData({
          showInput: true,
        });
      }
    },
    handleInputBlur: function (e) {
      if (!this.data.input) return;
      if (this.data.showInput) {
        this.setData({
          price: e.detail.value,
          showInput: false,
        });
      }
    },
  },
});
