import log from '@/common/log/log';
import pages from '@/common/page/pages';
import { showConfirmDialog } from '@/common/dialog/simples';

module.exports = Behavior({
  methods: {
    showSkuAddDialog: function ({ msg, optionList, spu }) {
      const { tag } = this.data;
      showConfirmDialog({
        title: '新增商品规格',
        content: `不存在「${msg}」规格的商品，是否新增？`,
        confirmBtn: '确认新增',
        cancelBtn: '取消',
        confirm: function () {
          require('@/package-goods/goods/popup/popup.js', (popup) => {
            popup.showGoodsAddSkuPopup(
              pages.currentPage(), //
              {
                spuId: spu._id,
                optionIdList: optionList.map((item) => item._id),
                title: '新增商品规格',
              },
            );
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
