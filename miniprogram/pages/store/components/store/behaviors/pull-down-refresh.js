module.exports = Behavior({
  data: {
    pdrEnabled: false,
  },
  methods: {
    handlePDRRefresh: async function () {
      this.setData({ pdrEnabled: true });
      await this._init();
      this.setData({ pdrEnabled: false });
    },
  },
});
