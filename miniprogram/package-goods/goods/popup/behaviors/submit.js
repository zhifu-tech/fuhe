const { default: log } = require('@/common/log/log');

module.exports = Behavior({
  data: {
    submitDisabled: true,
  },
  methods: {
    submit: function () {
      log.info('submit', this.data);
      if (this.data.isModeAddSpu) {
        this._submitAddSpu();
      } else if (this.data.isModeEditSpu) {
        this._submitEditSpu();
      } else if (this.data.isModeEditSku) {
        this._submitEditSku();
      } else if (this.data.isModeAddSku) {
        this._submitAddSku();
      } else if (this.data.isModeEditStock) {
        this._submitEditStock();
      } else if (this.data.isModeEditStockSuper) {
        this._submitEditStockSuper();
      }
    },
  },
});
