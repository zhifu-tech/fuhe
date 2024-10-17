const { default: log } = require('../../../../../common/log/log');

module.exports = Behavior({
  methods: {
    handleGoodsSkuDelete: function (e) {
      const { tag } = this.data;
      log.info(tag, 'handleGoodsSkuDelete', e);
    },
  },
});
