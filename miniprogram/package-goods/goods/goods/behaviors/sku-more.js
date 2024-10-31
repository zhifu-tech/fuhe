import pages from '@/common/page/pages';
import { showSimpleActionSheet } from '@/common/action-sheet/simples';

module.exports = Behavior({
  methods: {
    showActionMore: function () {
      showSimpleActionSheet({
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
          {
            label: '删除库存',
            value: '3',
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
            case '3': {
              this._handleDeleteSku();
              break;
            }
          }
        },
      });
    },
    _handleEditSpu: function () {
      require('@/package-goods/goods/popup/popup.js', (popup) => {
        const { spu, spuId } = this.data;
        popup.showGoodsEditSpuPopup(pages.currentPage(), {
          spuId,
          callback: () => {
            this.setData({
              spu,
            });
          },
        });
      }, ({ mod, errMsg }) => {
        console.error(`path: ${mod}, ${errMsg}`);
      });
    },
    _handleEditSku: function () {
      const { spu, sku, spuId, skuId } = this.data;
      require('@/package-goods/goods/popup/popup.js', (popup) => {
        popup.showGoodsEditSkuPopup(pages.currentPage(), {
          spuId,
          skuId,
          callback: () => {
            this.setData({
              sku,
            });
          },
        });
      }, ({ mod, errMsg }) => {
        console.error(`path: ${mod}, ${errMsg}`);
      });
    },
    _handleAddSku: function () {
      const { spu, spuId } = this.data;
      require('@/package-goods/goods/popup/popup.js', (popup) => {
        popup.showGoodsAddSkuPopup(pages.currentPage(), {
          spuId,
          callback: () => {
            this.setData({
              spu,
            });
          },
        });
      }, ({ mod, errMsg }) => {
        console.error(`path: ${mod}, ${errMsg}`);
      });
    },
    _handleDeleteSku: function () {
      this.showSkuDeleteDialog();
    },
  },
});
