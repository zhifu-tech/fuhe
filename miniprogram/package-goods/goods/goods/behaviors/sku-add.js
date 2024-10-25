import log from '@/common/log/log';
import pages from '@/common/page/pages';
import { showConfirmDialog } from '@/common/dialog/simples';

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
          require('@/package-goods/goods/popup/popup.js', (popup) => {
            popup.showGoodsAddSkuPopup(pages.currentpage(), {
              spu,
              sku: {
                optionList,
              },
            });
          }, ({ mod, errMsg }) => {
            console.error(`path: ${mod}, ${errMsg}`);
          });
        },
        cancel: (error) => {
          log.info(tag, 'sku-add', 'cancel', error);
        },
      });
    },
  },
});
