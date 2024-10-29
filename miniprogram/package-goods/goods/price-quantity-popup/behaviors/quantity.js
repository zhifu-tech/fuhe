module.exports = Behavior({
  methods: {
    handleChangeSaleQuantity: function (e) {
      this.setData({
        saleQuantity: e.detail.value,
      });
    },
  },
});
