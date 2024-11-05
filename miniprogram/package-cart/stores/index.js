import log from '@/common/log/log';
import { action, observable } from 'mobx-miniprogram';

export default (function () {
  const tagStore = 'cart-store';
  return observable({
    // 数据列表，对应原始数据
    // {
    //   _id,
    //   spuId,
    //   skuId,
    //   stockId,
    //   salePrice,
    //   saleQuantity,
    // },
    dataList: observable.array([]),

    // 数据映射，对应不同的层级
    // 1. spuId -> data-record
    // 2. skuId -> data-record
    // 3. stockId -> data-record
    // data-record: {
    //  list: [], // 数据列表中，包含spuId/skuId/stockId的数据条目
    //  sumPrices: 0,
    //  sumQuantities: 0,
    // }
    // 信息汇总记录，用来判定数据是否发生变化
    // 1. 对于某类spu, 记录其数量、价格总和（用来判定价格是否发生变化）
    // 2. 对于某类sku, 记录其数量、价格总和
    // 3. 对于某类stock, 记录其数量、价格总和
    dataMap: observable.map(),

    getSkuCartData: function (skuId) {
      return this.dataMap.get(skuId);
    },

    /** 更新拉取的数据到store中 */
    setFetchCartData: action(function ({ tag, records, total }) {
      log.info(tag, tagStore, 'setFetchCartData', records, total);
      this.dataList.replace(records);
      this.dataMap.clear();
      records.forEach((record) => {
        this._addDataRecord({ record });
      });
    }),

    getCartRecordList: function ({ _id, spuId, skuId, stockId, salePrice, saleQuantity }) {
      return this.dataList.filter((r) => {
        if (_id && r._id !== _id) return false;
        if (r.spuId !== spuId) return false;
        if (r.skuId !== skuId) return false;
        if (r.stockId !== stockId) return false;
        // 有销售价格时，查询具有相同销售价格的记录
        if (salePrice != undefined && r.salePrice !== salePrice) return false;
        // 有销售数量时，查询具有相同销售数量的记录（只允许一条具有相同价格、相同数量的记录
        if (saleQuantity && r.saleQuantity !== saleQuantity) return false;
        return true;
      });
    },
    getCardRecord: function ({ tag, _id }) {
      const res = this.getCartRecordList({ tag, _id });
      return res.length > 0 ? res[0] : null;
    },
    addCartRecord: action(function ({ tag, record }) {
      log.info(tag, tagStore, 'addCartRecord', record);
      // 1. 过滤出符合条件的所有记录
      const recordList = this.getCartRecordList({
        tag,
        spuId: record.spuId,
        skuId: record.skuId,
        stockId: record.stockId,
      });
      // 2. 有记录，更新记录: 删除记录，然后重新添加
      if (recordList.length !== 0) {
        log.info(tag, tagStore, 'addCartRecord', 'found record, update directly!');
        recordList.forEach((r) => {
          this.deleteCartRecord({ tag, record: r });
        });
      }
      // 3. 更新data-record
      this._addDataRecord({ record });
      // 4. 更新data-list，新增添加到首位
      this.dataList.unshift(record);
    }),
    deleteCartRecord: action(function ({ tag, record }) {
      log.info(tag, tagStore, 'deleteCartRecord', record);
      const { _id } = record;
      // 删除具有相同id的记录
      const i = this.dataList.findIndex((r) => r._id === _id);
      if (i >= 0) {
        this.dataList.splice(i, 1);
      }
      // 删除data-record
      this._removeDataRecord({ record });
    }),
    updateCartRecord: action(function ({ tag, record, salePrice, saleQuantity }) {
      log.info(
        tag,
        tagStore,
        'updateCartRecord',
        salePrice,
        saleQuantity,
        record.salePrice,
        record.saleQuantity,
      );
      const preSalePrice = record.salePrice;
      const preSaleQuantity = record.saleQuantity;

      // 更新 record
      record.salePrice = salePrice;
      record.saleQuantity = saleQuantity;
      // 手动强制触发更新
      this.dataList.replace(this.dataList);

      // 更新data-record
      this._updateDataRecord({ record, preSalePrice, preSaleQuantity });
    }),

    //****** 私有方法 ***
    _addDataRecord: action(function ({ record }) {
      const { spuId, skuId, stockId } = record;
      const totalPrice = record.salePrice * record.saleQuantity;
      const _add = (id) => {
        const dataRecord = this._getOrCreateDataRecord(id, true);
        dataRecord.list.push(record);
        dataRecord.sumPrices += totalPrice;
        dataRecord.sumQuantities += record.saleQuantity;
      };
      // 1. spuId -> data-record
      _add(spuId);
      // 2. skuId -> data-record
      _add(skuId);
      // 3. stockId -> data-record
      _add(stockId);
    }),
    _removeDataRecord: action(function ({ record }) {
      const { spuId, skuId, stockId, salePrice, saleQuantity } = record;
      const totalPrice = salePrice * saleQuantity;
      const _remove = (id) => {
        const dataRecord = this._getOrCreateDataRecord(id, false);
        if (!dataRecord) return;
        const i = dataRecord.list.findIndex((r) => r._id === record._id);
        if (i >= 0) {
          dataRecord.list.splice(i, 1);
          // 如果记录为空，删除data-record
          if (dataRecord.list.length === 0) {
            this.dataMap.delete(id);
          }
        }
        dataRecord.sumPrices -= totalPrice;
        dataRecord.sumQuantities -= saleQuantity;
      };
      // 1. spuId -> data-record
      _remove(spuId);
      // 2. skuId -> data-record
      _remove(skuId);
      // 3. stockId -> data-record
      _remove(stockId);
    }),
    _updateDataRecord: action(function ({ record, preSalePrice, preSaleQuantity }) {
      const { spuId, skuId, stockId, salePrice, saleQuantity } = record;
      const deletaPrices =
        salePrice * saleQuantity - // 新记录
        preSalePrice * preSaleQuantity; // 旧记录
      const deltaQuantities = saleQuantity - preSaleQuantity;

      const _update = (id) => {
        const dr = this._getOrCreateDataRecord(id, false);
        if (dr) {
          dr.sumPrices += deletaPrices;
          dr.sumQuantities += deltaQuantities;
          // 强制更新
          this.dataMap.set(id, { ...dr });
        }
      };
      // 1. spuId -> data-record
      _update(spuId);
      // 2. skuId -> data-record
      _update(skuId);
      // 3. stockId -> data-record
      _update(stockId);
    }),
    _getOrCreateDataRecord: action(function (id, enableCreate = true) {
      let dataRecord = this.dataMap.get(id);
      if (!dataRecord && enableCreate) {
        this.dataMap.set(id, {
          list: [],
          sumPrices: 0,
          sumQuantities: 0,
        });
        dataRecord = this.dataMap.get(id);
      }
      return dataRecord;
    }),
  });
})();
