import { showSimpleActionSheet } from '@/common/action-sheet/simples';

module.exports = Behavior({
  methods: {
    handleMenuClick: function () {
      showSimpleActionSheet({
        items: [
          {
            label: '新增商品',
            value: '0',
            selectedFn: this.handleShowGoodsPopup.bind(this),
          },
          {
            label: '新增分类',
            value: '1',
            selectedFn: this._showCategoryPopup.bind(this),
          },
          {
            label: this.data.showSideBar ? '收起侧边栏' : '展开侧边栏',
            value: '2',
            selectedFn: this.handleSideBarFold.bind(this),
          },
        ],
      });
    },
  },
});
