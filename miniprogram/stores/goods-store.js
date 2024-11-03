import log from '@/common/log/log';
import services from '@/services/index';
import { observable, action, flow, get, set } from 'mobx-miniprogram';

export default (function store() {
  const tagStore = 'goods-store';
  // p.s. dataMap和spuMap需要确保spu是一致的
  const dataMap = observable.map(); // map<cId, goods-object >
  const spuMap = observable.map(); // map<spu._id, spu>
  let _fetchGoodsSpuListTask = null; // 记录当前正在进行的请求

  return observable({
    selected_cId: '0',
    get selected() {
      let selected = dataMap.get(this.selected_cId);
      if (!selected) {
        selected = observable({
          cId: this.selected_cId,
          total: 0,
          pageNumber: 0,
          spuList: [],
        });
        dataMap.set(this.selected_cId, selected);
      }
      return selected;
    },
    fetchGoodsSpuListStatus: {
      code: 'idle', // 'idle', 'loading', 'success', 'error'
      error: null,
      trigger: '',
    },
    setSelectedCategory: action(function ({ tag, cId, trigger }) {
      const data = dataMap.get(cId);
      if (data) {
        // 有请求数据，直接切换
        log.info(tag, 'switchGoodsSpuList', 'has data');
        this.selected_cId = cId;
        return data.pageNumber === 0;
      } else {
        // 如果数据不存在，切换并且请求数据
        log.info(tag, 'switchGoodsSpuList', 'no data');
        this.selected_cId = cId;
        return true;
      }
    }),
    setFetchGoodsSpuListStatus: action(function ({ code, error, trigger }) {
      this.fetchGoodsSpuListStatus = { code, error, trigger };
    }),
    setFetchGoodsSpuListResult: action(function ({
      tag,
      cId,
      spuList,
      total,
      pageNumber,
      trigger,
    }) {
      // 保存数据到map中，后面数据更新可能会用到
      this._setSpuList(spuList);
      // 此时 data 和selected 一致的，指向同一个对象
      const data = dataMap.get(cId) || {};
      // 保存请求结果
      if (pageNumber === 1) {
        data.total = total;
        data.pageNumber = 1;
        data.spuList.replace(spuList);
      } else {
        data.total = total;
        data.pageNumber = pageNumber;
        data.spuList.replace([...data.spuList, ...spuList]);
      }
    }),
    // /**  获取商品列表: 每次只能有一个请求，如果上次请求未结束，则取消请求. */
    // fetchGoodsSpuList: action(function ({ tag, cId, pageNumber, trigger }) {
    //   // 目前只支持的单一tab的显示和处理，所以需要取消上一次的请求
    //   if (_fetchGoodsSpuListTask) {
    //     _fetchGoodsSpuListTask.cancel();
    //   }
    //   _fetchGoodsSpuListTask = this._fetchGoodsSpuList({
    //     tag,
    //     cId,
    //     pageNumber,
    //     trigger,
    //   });
    //   return _fetchGoodsSpuListTask;
    // }),
    // _fetchGoodsSpuList: flow(function* ({ tag, cId, pageNumber, trigger }) {
    //   log.info(tag, '_fetchGoodsSpuList', trigger, cId, pageNumber);
    //   try {
    //     // 请求中，切换选中状态
    //     this.fetchGoodsSpuListStatus = { code: 'loading', trigger };
    //     const { records: spuList, total } = yield services.goods.spuList({
    //       tag,
    //       cId,
    //       pageNumber,
    //       pageSize: 10,
    //     });
    //     // 保存数据到map中，后面数据更新可能会用到
    //     this._setSpuList(spuList);

    //     // 此时 data 和selected 一致的，指向同一个对象
    //     const data = dataMap.get(cId) || {};
    //     // 保存请求结果
    //     if (pageNumber === 1) {
    //       data.total = total;
    //       data.pageNumber = 1;
    //       data.spuList.replace(spuList);
    //     } else {
    //       data.total = total;
    //       data.pageNumber = pageNumber;
    //       data.spuList.replace([...data.spuList, ...spuList]);
    //     }

    //     // 请求成功，切换选中状态
    //     this.fetchGoodsSpuListStatus = { code: 'success', trigger };
    //     log.info(tag, '_fetchGoodsSpuList result', data);
    //   } catch (error) {
    //     // 请求失败，切换选中状态
    //     this.fetchGoodsSpuListStatus = { code: 'error', trigger };
    //     log.error(tag, '_fetchGoodsSpuList', error);
    //   } finally {
    //     // 重置任务状态
    //     _fetchGoodsSpuListTask = null;
    //   }
    // }),

    //********************************
    // [Start] SPU & SKU & STOCK
    // ********************************
    getSpu: function (spuId) {
      const spu = spuMap.get(spuId);
      if (spu && spu.hasDraft) {
        return spuMap.get(`-${spuId}`) || spu;
      }
      return spu;
    },
    getSku: function (spuId, skuId) {
      const spu = this.getSpu(spuId);
      return spu?.skuList?.find((sku) => sku._id === skuId);
    },
    getStock: function (spuId, skuId, stockId) {
      const sku = this.getSku(spuId, skuId);
      return sku?.stockList?.find((stock) => stock._id === stockId);
    },
    _setSpuList: action(function (spuList) {
      spuList.forEach((spu) => {
        spuMap.set(spu._id, spu);
      });
    }),
    setSpuDraft: action(function (spuId, draft) {
      const spu = this.getSpu(spuId);
      if (!spu || spu.hasDraft || !draft) return;
      spu.hasDraft = true;
      spuMap.set(`-${spuId}`, draft);
    }),
    cleanSpuDraft: action(function (spuId) {
      const spu = this.getSpu(spuId);
      if (!spu || !spu.hasDraft) return;
      spu.hasDraft = false;
      spuMap.delete(`-${spuId}`);
    }),

    addGoodsSpu: action(function ({ tag, spu }) {
      log.info(tag, tagStore, 'addGoodsSpu', spu.title);
      // 加入到spu-map中
      spuMap.set(spu._id, spu);
      // 加入到对应分类列表的首位
      let data = dataMap.get(spu.cId);
      if (data) {
        data.spuList.replace([spu, ...data.spuList]);
        log.info(tag, tagStore, 'addGoodsSpu', 'add by cId');
      }
      data = dataMap.get('1'); // 所有分类
      if (data) {
        data.spuList.replace([spu, ...data.spuList]);
        log.info(tag, tagStore, 'addGoodsSpu', 'add by all');
      }
    }),
    updateGoodsSpu: action(function ({ tag, spu: updated }) {
      const spu = spuMap.get(updated._id);
      if (!spu) {
        log.info(tag, tagStore, 'updateGoodsSpu', 'no spu');
        return;
      }
      // 如果spu和updated一样，说明是同一个对象，不需要更新
      if (spu === updated) {
        log.info(tag, tagStore, 'updateGoodsSpu', 'same spu');
        return;
      }
      // 更新spu相关信息
      if (updated.title) spu.title = updated.title;
      if (updated.desc) spu.desc = updated.desc;
      log.info(tag, tagStore, 'updateGoodsSpu', spu);
    }),
    deleteGoodsSku: action(function ({ spuId, skuId }) {
      const spu = spuMap.get(spuId);
      if (!spu) {
        log.info(tag, tagStore, 'deleteGoodsSku', 'no spu');
        return;
      }
      const skuIndex = spu.skuList.findIndex((sku) => sku._id === skuId);
      if (skuIndex === -1) {
        log.info(tag, tagStore, 'deleteGoodsSku', 'no sku');
        return;
      }
      spu.skuList.splice(skuIndex, 1);
      log.info(tag, tagStore, 'deleteGoodsSku', 'delete sku');
    }),
  });
})();
