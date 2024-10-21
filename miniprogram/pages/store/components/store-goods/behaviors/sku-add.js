import log from '@/common/log/log';
import { showConfirmDialog } from '@/common/dialog/simples';
const { showGoodsAddSkuPopup } = require('../../store-goods-popup/popups');

module.exports = Behavior({
  methods: {
    showSkuAddDialog: function ({ msg, optionList, spu }) {
      const { tag } = this.data;
      showConfirmDialog({
        title: '新增库存',
        content: `不存在「${msg}」规格的商品，是否新增？`,
        confirmBtn: '确认新增',
        cancelBtn: '取消',
        confirm: () => {
          showGoodsAddSkuPopup({
            spu,
            sku: {
              optionList,
            },
          });
        },
        cancel: (error) => {
          log.info(tag, 'sku-add', 'cancel', error);
        },
      });
    },
  },
});
