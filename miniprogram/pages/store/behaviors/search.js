import log from '@/common/log/log';
import stores from '@/stores/index';

module.exports = Behavior({
  data: {
    searchValue: '', // 当前搜索值
  },
  methods: {
    filterWithSearchKey: function (goodsSpuList) {
      const goodsList = goodsSpuList.flatMap((spu) =>
        spu.skuList.map((sku) => ({ _id: sku._id, spu, sku })),
      );
      if (this.data.searchValue === '') {
        return goodsList;
      }
      return goodsList.filter(({ spu, sku }) => {
        // 商品信息和规格信息
        const title = spu.title + sku.optionList.reduce((acc, cur) => acc + ' ' + cur.title, '');
        if (title.includes(this.data.searchValue)) return true;

        // 供应商匹配
        const supplierMatch = sku.supplierName?.includes(this.data.searchValue);
        if (supplierMatch) return true;

        // 库存信息匹配
        const stockMatch = sku.stockList?.some((stock) =>
          stock.createdAtFormatted?.includes(this.data.searchValue),
        );
        if (stockMatch) return true;

        return false;
      });
    },
    handleSearchChange: function (e) {
      this.data.searchValue = e.detail.value;
      log.info(this.data.tag, 'handleSearchChange', this.data.searchValue);
      this.setData({
        goodsList: this.filterWithSearchKey(stores.goods.selected.spuList),
      });
    },
    handleSearchClear: function () {
      if (!this.data.searchValue) {
        return;
      }
      this.setData({
        searchValue: '',
        goodsList: stores.goods.selected.spuList,
      });
    },
  },
});
