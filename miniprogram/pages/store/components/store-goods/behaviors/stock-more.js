const { default: log } = require('@/common/log/log');
const { default: pages } = require('../../../../../common/page/pages');

module.exports = Behavior({
  methods: {
    showStockActionMore: function (e) {
      pages
        .currentPage()
        .root()
        ?.showActionSheet({
          items: [
            {
              label: '修改库存信息',
              value: '0',
            },
          ],
          selected: (value) => {
            const { spu, sku } = this.data;
            switch (value) {
              case '0': {
                pages.currentPage().root().showGoodsEditSkuPopup({
                  spu,
                  sku,
                });
                break;
              }
              case '1': {
                pages.currentPage().root().showGoodsEditSpuPopup({
                  spu,
                });
                break;
              }
              case '2': {
                pages.currentPage().root().showGoodsAddSpuPopup({
                  spu,
                });
                break;
              }
              case '3': {
                pages.currentPage().root().showGoodsAddSpuPopup({
                  spu,
                });
                break;
              }
            }
          },
        });
    },
  },
});
