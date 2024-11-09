import log from '@/common/log/log';
import spu from './spu';
import sku from './sku';
import { observable, action } from 'mobx-miniprogram';

export default (function store() {
  const tagStore = 'goods-store';
  // dataMap为列表数据的存储，spuMap为所有spu的存储。
  // 1. dataMap和spuMap需要确保spu是一致的。
  // 2. 在列表中，以dataMap中的数据为基准;
  // 3. spuMap是app内所有spu的集合，是全集；dataMap中的spu时子集。
  // 4. 如果修改spuMap中的数据，在spu中修改，一定会生效dataMap中的spu
  const dataMap = observable.map(); // map<cId, goods-object >
  const spuMap = observable.map(); // map<spu._id, spu>

  return observable({
    spu,
    sku,
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
    set selected(cId) {
      this.selected_cId = cId;
    },
    checkNeedFetchedData: function ({ tag, cId }) {
      const data = dataMap.get(cId);
      if (data) {
        // 有请求数据，直接切换
        log.info(tag, 'switchGoodsSpuList', 'has data');
        return data.pageNumber === 0;
      } else {
        // 如果数据不存在，切换并且请求数据
        log.info(tag, 'switchGoodsSpuList', 'no data');
        return true;
      }
    },
    setGoodsSpuListResult: action(function ({ tag, cId, spuList, total, pageNumber }) {
      // 此时 data 和selected 一致的，指向同一个对象
      const data = this.selected;
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
      // 保存数据到全局的spu map中
      this._setSpuList({
        tag,
        spuList: data.spuList,
        updateList: false,
      });
    }),
    setGoodsSpuListResultByIdList: action(function ({ tag, spuList }) {
      // 保存数据到map中，后面数据更新可能会用到
      this._setSpuList({
        tag,
        spuList,
        updateList: true,
      });
    }),

    //********************************
    // [Start] SPU & SKU & STOCK
    // ********************************
    getSpu: function (spuId) {
      return spuMap.get(spuId);
    },
    getSpuSpecList: function (spuId) {
      return spuMap.get(spuId)?.specList || [];
    },
    getSku: function (spuId, skuId) {
      const spu = this.getSpu(spuId);
      return spu?.skuList?.find((sku) => sku._id === skuId);
    },
    getStock: function (spuId, skuId, stockId) {
      const sku = this.getSku(spuId, skuId);
      return sku?.stockList?.find((stock) => stock._id === stockId);
    },
    _setSpuList: action(function ({ tag, spuList, updateList }) {
      spuList.forEach((spu) => {
        this.setGoodsSpu({ tag, spu, updateList });
      });
    }),

    setGoodsSpu: action(function ({ tag, spu, updateList }) {
      // 加入到spu-map中
      spuMap.set(spu._id, spu);
      if (updateList) {
        // 查找对应分类是否存在
        let data = dataMap.get(spu.cId);
        if (data) {
          // 查找对应分类是否存在
          const index = data.spuList.findIndex(({ _id }) => spu._id === spu._id);
          if (index !== -1) {
            data.spuList[index] = spu;
          }
        }
        data = dataMap.get('1'); // 所有分类
        if (data) {
          const index = data.spuList.findIndex(({ _id }) => _id === spu._id);
          if (index !== -1) {
            data.spuList[index] = spu;
          }
        }
      }
    }),
    addGoodsSpu: action(function ({ tag, spu, addToList = true }) {
      log.info(tag, tagStore, 'addGoodsSpu', spu.title);
      // 加入到spu-map中
      spuMap.set(spu._id, spu);
      if (!addToList) {
        // 不加入列表
        return;
      }
      // 加入到对应分类列表的首位
      let data = dataMap.get(spu.cId);
      if (data) {
        data.spuList.unshift(spu);
        log.info(tag, tagStore, 'addGoodsSpu', 'add by cId');
      }
      // 所有分类
      data = dataMap.get('1');
      if (data) {
        data.spuList.unshift(spu);
        log.info(tag, tagStore, 'addGoodsSpu', 'add by all');
      }
    }),
    deleteGoodsSpu: action(function ({ tag, spuId }) {
      const res = spuMap.delete(spuId);
      log.info(tag, tagStore, 'deleteGoodsSpu', spuId, res);
      let data = dataMap.get(spu.cId);
      if (data) {
        const index = data.spuList.findIndex((spu) => spu._id === spuId);
        if (index !== -1) {
          data.spuList.splice(index, 1);
        }
      }
      data = dataMap.get('1'); // 所有分类
      if (data) {
        const index = data.spuList.findIndex((spu) => spu._id === spuId);
        if (index !== -1) {
          data.spuList.splice(index, 1);
        }
      }
    }),
    deleteGoodsSku: action(function ({ tag, spuId, skuId }) {
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
