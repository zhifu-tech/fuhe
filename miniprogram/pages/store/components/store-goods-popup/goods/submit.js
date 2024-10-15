module.exports = Behavior({
  data: {
    submitDisabled: true,
  },
  methods: {
    submit: function () {
      if (this.data.isModeAddSpu) {
        this._submitAddSpu();
      } else if (this.data.isModeEditSpu) {
        this._submitEditSpu();
      } else if (this.data.isModeEditSku) {
        this._submitEditSku();
      } else if (this.data.isModeAddSku) {
        this._submitAddSku();
      }
    },
  },
});
