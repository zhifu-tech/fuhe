import log from '@/common/log/log';
import { saasId } from '../../../common/saas/saas';

export default {
  _createParams: ({
    // 商品编码
    spuId,
    skuId,
    // 价格、数量信息
    costPrice,
    salePrice,
    originalPrice,
    quantity,
  }) => ({
    // 商户信息
    saasId: saasId(),
    // 商品编码
    spuId,
    spu: {
      _id: spuId,
    },
    skuId,
    sku: {
      _id: skuId,
    },
    // 价格、数量信息
    costPrice,
    salePrice,
    originalPrice,
    quantity,
  }),
  _selecteParams: () => ({
    _id: true,
    // 商户信息
    saasId: true,
    // 商品编码
    code: true,
    spuId: true,
    skuId: true,
    // 价格、数量信息
    costPrice: true,
    salePrice: true,
    originalPrice: true,
    quantity: true,
    // 通用信息
    createdAt: true,
    updatedAt: true,
  }),
  create: async function ({ tag, param }) {
    try {
      const { data } = await wx.cloud.models.fh_stock.create({
        data: this._createParams(param),
      });
      log.info(tag, 'stock-create', data);
      return data.id;
    } catch (error) {
      log.error(tag, 'stock-create', error);
      throw error;
    }
  },
  createMany: async function ({ tag, paramList }) {
    try {
      const { data } = await wx.cloud.models.fh_stock.createMany({
        data: paramList.map(this._createParams),
      });
      log.info(tag, 'stock-create', data);
      return data.idList;
    } catch (error) {
      log.error(tag, 'stock-create', error);
      throw error;
    }
  },
  get: async function ({ tag, _id }) {
    try {
      const { data } = await wx.cloud.models.fh_stock.get({
        select: this._selecteParams(),
        filter: {
          where: {
            $and: [{ _id: { $eq: _id } }],
          },
        },
      });
      log.info(tag, 'stock-get', data);
      return data;
    } catch (error) {
      log.error(tag, 'stock-get', error);
      throw error;
    }
  },
  list: async function ({
    tag, //
    spuId,
    skuId,
    skuIdList,
    pageNumber = 1,
    pageSize = 200,
    sortbyUpdated = true,
  }) {
    try {
      const { data } = await wx.cloud.models.fh_stock.list({
        select: this._selecteParams(),
        filter: {
          where: {
            $and: [
              // { saasId: { $eq: saasId() } },
              ...((spuId && [{ spuId: { $eq: spuId } }]) || []),
              ...((skuId && [{ skuId: { $eq: skuId } }]) || []),
              ...((skuIdList && [{ skuId: { $in: skuIdList } }]) || []),
            ],
          },
        },
        orderBy: [
          ...((sortbyUpdated && [{ updatedAt: 'desc' }]) || []),
          ...((!sortbyUpdated && [{ createdAt: 'desc' }]) || []),
        ],
        getCount: true,
        pageNumber,
        pageSize,
      });
      log.info(tag, 'stock-list', data);
      return data;
    } catch (error) {
      log.error(tag, 'stock-list', error);
      throw error;
    }
  },
  all: async function ({
    tag, //
    spuId,
    skuId,
    sortbyUpdated = true,
  }) {
    try {
      let pageNumber = 0;
      let results = [];
      let totals = 0;
      do {
        ++pageNumber;
        const { rescords, total } = await this.list({
          tag,
          spuId,
          skuId,
          pageNumber,
          pageSize: 200,
          sortbyUpdated,
        });
        totals = total;
        results = results.concat(rescords);
      } while (results.length < totals);

      log.info(tag, 'stock-all', results);
      return { records: results, total: totals };
    } catch (error) {
      log.error(tag, 'stock-all', error);
      throw error;
    }
  },
  update: async function ({ tag, _id, param }) {
    try {
      const { data } = await wx.cloud.models.fh_stock.update({
        data: {
          ...(param.quantity != null && { quantity }),
          ...(param.costPrice != null && { costPrice }),
          ...(param.salePrice != null && { salePrice }),
          ...(param.originalPrice != null && { originalPrice }),
        },
        filter: {
          where: {
            $and: [{ _id: { $eq: _id } }],
          },
        },
      });
      log.info(tag, 'stock-update', data);
      return data;
    } catch (error) {
      log.error(tag, 'stock-update', error);
      throw error;
    }
  },
  delete: async function ({ tag, _id }) {
    try {
      const { data } = await wx.cloud.models.fh_stock.delete({
        filter: {
          where: {
            $and: [{ _id: { $eq: _id } }],
          },
        },
      });
      log.info(tag, 'stock-delete', data);
      return data;
    } catch (error) {
      log.error(tag, 'stock-delete', error);
      throw error;
    }
  },
};
