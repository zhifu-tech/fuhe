import log from '@/common/log/log';
import services from '@/services/index';
import { configure, observable, action, flow } from 'mobx-miniprogram';

configure({
  enforceActions: true, // 不允许在动作之外进行状态修改
});
export default (function store() {
  const spuMap = new Map(); // map<spu._id, spu>
  const skuMap = new Map(); // map<sku._id, sku>
  const dataMap = new Map(); // map<cId, goodsSpuList>
  let _fetchGoodsSpuListTask = null; // 记录当前正在进行的请求

  const defaultGoods = {
    cId: 0,
    spuList: [],
    total: 0,
    pageNumber: 1,
    isDefault: true,
  };

  return observable({
    selected: defaultGoods,

    //****************
    // [START] 商品
    // ****************
    getSpu: function (spuId) {
      return spuMap.get(spuId);
    },
    getSku: function (skuId) {
      return skuMap.get(skuId);
    },
    _setSpuList: action(function (spuList) {
      spuList.forEach((spu) => {
        spuMap.set(spu._id, spu);

        spu.skuList.forEach((sku) => {
          skuMap.set(sku._id, sku);
        });
      });
    }),
    //****************
    // [END] 商品
    // ****************

    //****************
    // [START] 商品列表
    // ****************
    fetchGoodsSpuListStatus: { code: 'idle' }, // 'loading', 'success', 'error'

    switchSelectedGoodsSpuList: action(function (cId) {
      this.selected = dataMap.get(cId) || defaultGoods;
      log.info('store', 'switchSelectedGoodsSpuList', cId, this.selected);
    }),

    /**  获取商品列表: 每次只能有一个请求，如果上次请求未结束，则取消请求. */
    fetchGoodsSpuList: action(function ({ tag, cId, pageNumber }) {
      if (_fetchGoodsSpuListTask) {
        _fetchGoodsSpuListTask.cancel();
      }
      this.fetchGoodsSpuListStatus = { code: 'loading' };
      _fetchGoodsSpuListTask = this._fetchGoodsSpuList({ tag, cId, pageNumber });
      return _fetchGoodsSpuListTask;
    }),

    _fetchGoodsSpuList: flow(function* ({ tag, cId, pageNumber }) {
      try {
        const { records: spuList, total } = yield services.goods.spuList({
          tag,
          cId,
          pageNumber,
          pageSize: 10,
        });
        let data = dataMap.get(cId);
        if (!data) {
          dataMap.set(cId, (data = { cId }));
        }
        if (pageNumber === 1) {
          data.total = total;
          data.pageNumber = 1;
          data.spuList = spuList;
        } else {
          data.total = total;
          data.pageNumber = pageNumber;
          data.spuList = [...data.spuList, ...spuList];
        }
        this.selected = data;
        // 保存 spuList到缓存
        this._setSpuList(spuList);

        this.fetchGoodsSpuListStatus = { code: 'success' };
        log.info(tag, '_fetchGoodsSpuList result', data);
      } catch (error) {
        this.fetchGoodsSpuListStatus = { code: 'error', error };
        log.error(tag, '_fetchGoodsSpuList', error);
      } finally {
        this._fetchGoodsSpuListTask = null;
      }
    }),
    //****************
    // [END] 商品列表
    //****************
  });
})();
