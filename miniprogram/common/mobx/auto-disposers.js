module.exports = Behavior({
  lifetimes: {
    detached: function () {
      if (this.disposers) {
        this.disposers.forEach((disposer) => disposer());
        this.disposers = null;
      }
    },
  },
});
