const { default: log } = require('@/common/log/log');
const { default: pages } = require('../../../../../common/page/pages');

module.exports = Behavior({
  methods: {
    showActionMore: function (e) {
      pages
        .currentPage()
        .root()
        ?.showActionSheet({
          items: [
            {
              label: '修改库存信息',
              value: '0',
            },
            {
              label: '修改商品信息',
              value: '1',
            },
            {
              label: '新增库存',
              value: '2',
            },
          ],
          selected: (value) => {
            switch (value) {
              case '0': {
                this._handleEditSku();
                break;
              }
              case '1': {
                this._handleEditSpu();
                break;
              }
              case '2': {
                this._handleAddSku();
                break;
              }
            }
          },
        });
    },
    _handleAddSpu: function () {
      const { spu } = this.data;
      pages.currentPage().root().showGoodsAddSpuPopup({
        spu,
      });
    },
    _handleEditSpu: function () {
      const { spu } = this.data;
      pages
        .currentPage()
        .root()
        .showGoodsEditSpuPopup({
          spu,
          callback: () => {
            this.setData({
              spu,
            });
          },
        });
    },
    _handleEditSku: function () {
      const { spu, sku } = this.data;
      pages
        .currentPage()
        .root()
        .showGoodsEditSkuPopup({
          spu,
          sku,
          callback: () => {
            this.setData({
              sku,
            });
          },
        });
    },
    _handleAddSku: function () {
      const { spu } = this.data;
      pages
        .currentPage()
        .root()
        .showGoodsAddSkuPopup({
          spu,
          callback: () => {
            this.setData({
              spu,
            });
          },
        });
    },
  },
});
