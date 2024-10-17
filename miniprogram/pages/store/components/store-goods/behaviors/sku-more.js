import { showSimpleActionSheet } from '../../../../../common/action-sheet/simples';
import { showGoodsAddSpuPopup, showGoodsEditSpuPopup } from '../../store-goods-popup/popups';

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
    _handleAddSpu: function () {
      const { spu } = this.data;
      showGoodsAddSpuPopup({
        spu,
      });
    },
    _handleEditSpu: function () {
      const { spu } = this.data;
      showGoodsEditSpuPopup({
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
      showGoodsEditSkuPopup({
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
      showGoodsAddSkuPopup({
        spu,
        callback: () => {
          this.setData({
            spu,
          });
        },
      });
    },
    _handleDeleteSku: function () {
      this.showSkuDeleteDialog();
    },
  },
});
