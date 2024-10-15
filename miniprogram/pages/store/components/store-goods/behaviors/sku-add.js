const { default: log } = require('../../../../../common/log/log');
const { default: pages } = require('../../../../../common/page/pages');
import Dialog from 'tdesign-miniprogram/dialog/index';

module.exports = Behavior({
  methods: {
    showSkuAddDialog: function ({ msg, optionList, spu }) {
      const { tag } = this.data;
      Dialog.confirm({
        context: pages.currentPage().store(),
        title: '新增库存',
        content: `不存在「${msg}」规格的商品，是否新增？`,
        confirmBtn: '确认新增',
        cancelBtn: '取消',
        zIndex: pages.zIndexDialog,
        overlayProps: {
          zIndex: pages.zIndexDialogOverlay,
        },
      })
        .then(() => {
          pages.currentPage().store().showGoodsAddSkuPopup({
            spu,
            sku: {
              optionList,
            },
          });
        })
        .catch((error) => {
          log.info(tag, 'sku-add', 'cancel', error);
        });
    },
  },
});
