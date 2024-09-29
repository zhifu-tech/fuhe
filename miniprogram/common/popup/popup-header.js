module.exports = Behavior({
  data: {
    title: null,
    comfirmDisabled: true,
  },
  methods: {
    onCancelClick: function () {
      this.hidePopup();
    },
  },
});
