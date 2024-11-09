import pages from '@/common/page/pages';
import { showSimpleActionSheet } from '@/common/action-sheet/simples';

module.exports = Behavior({
  methods: {
    showActionMore: function () {
      showSimpleActionSheet({
        items: [
          {
            label: '修改商品规格',
            value: '0',
            selectedFn: this._handleEditSku.bind(this),
          },
          {
            label: '修改商品信息',
            value: '1',
            selectedFn: this._handleEditSpu.bind(this),
          },
          {
            label: '新增商品规格',
            value: '2',
            selectedFn: this._handleAddSku.bind(this),
          },
          {
            label: '删除商品规格',
            value: '3',
            selectedFn: this._handleDeleteSku.bind(this),
          },
        ]
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
    _handleEditSpu: function () {
      require('@/package-goods/goods/popup/popup.js', (popup) => {
        const { spu, spuId } = this.data;
        popup.showGoodsEditSpuPopup(pages.currentPage(), {
          spuId,
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
