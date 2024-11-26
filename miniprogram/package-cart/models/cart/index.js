import log from '@/common/log/log';
import { saasId } from '@/common/saas/saas';

export default {
  _createParam: ({
    // 商品/库存信息
    spuId,
    skuId,
    stockId,
    // 库存信息
    salePrice,
    saleQuantity,
  }) => ({
    // 商户信息
    saasId: saasId(),
    // 库存信息
    spuId,
    skuId,
    stockId,
    // 价格及数量
    salePrice,
    saleQuantity,
  }),
  _selectParam: () => ({
    _id: true,
    // 商户信息
    saasId: true,
    // 库存信息
    spuId: true,
    skuId: true,
    stockId: true,
    // 价格及数量
    salePrice: true,
    saleQuantity: true,
    // 共有信息
    createdAt: true,
    updateAt: true,
  }),
  create: async function ({ tag, spuId, skuId, stockId, salePrice, saleQuantity }) {
    try {
      const { data } = await wx.cloud.models.fh_cart.create({
        data: this._createParam({ spuId, skuId, stockId, salePrice, saleQuantity }),
      });
      log.info(tag, 'cart-create', data);
      return data.id;
    } catch (error) {
      log.error(tag, 'cart-create', error);
      throw error;
    }
  },
  createMany: async function ({ tag, infoList }) {
    try {
      const { data } = await wx.cloud.models.fh_cart.createMany({
        data: infoList.map(this._createParam),
      });
      log.info(tag, 'cart-createMany', data);
      return data.idList;
    } catch (error) {
      log.error(tag, 'cart-createMany', error);
      throw error;
    }
  },
  get: async function ({ tag, _id }) {
    try {
      const { data } = await wx.cloud.models.fh_cart.get({
        select: this._selectParam(),
        filter: {
          where: {
            $and: [{ _id: { $eq: _id } }],
          },
        },
      });
      log.info(tag, 'cart-get', data);
      return data;
    } catch (error) {
      log.error(tag, 'cart-get', error);
      throw error;
    }
  },
  list: async function ({ tag, pageNumber }) {
    try {
      const { data } = await wx.cloud.models.fh_cart.list({
        select: this._selectParam(),
        filter: {
          where: {
            $and: [{ saasId: { $eq: saasId() } }],
          },
        },
        sortby: [{ createdAt: 'desc' }],
        getCount: true,
        pageNumber,
        pageSize: 200,
      });
      log.info(tag, 'cart-list', data);
      return data;
    } catch (error) {
      log.error(tag, 'cart-list', error);
      throw error;
    }
  },
  all: async function ({ tag }) {
    try {
      let pageNumber = 0;
      let results = [];
      let totals = 0;
      do {
        ++pageNumber;
        const { records, total } = await this.list({ tag, pageNumber });
        totals = total;
        results = results.concat(records);
      } while (results.length < totals);

      log.info(tag, 'cart-all', results);
      return { records: results, total: results.length };
    } catch (error) {
      log.error(tag, 'cart-all', error);
      throw error;
    }
  },
  deleteMany: async function ({ tag, idList }) {
    try {
      const { data } = await wx.cloud.models.fh_cart.deleteMany({
        filter: {
          where: {
            $and: [{ _id: { $in: idList } }],
          },
        },
      });

      log.info(tag, 'cart-delete', data);
      return data;
    } catch (error) {
      log.error(tag, 'cart-delete', error);
      throw error;
    }
  },
  update: async function ({ tag, _id, salePrice, saleQuantity }) {
    try {
      const data = await wx.cloud.models.fh_cart.update({
        data: {
          salePrice,
          saleQuantity,
        },
        filter: {
          where: {
            $and: [{ _id: { $eq: _id } }],
          },
        },
      });
      return data;
    } catch (error) {
      log.error(tag, 'cart-update', error);
      throw error;
    }
  },
  updateMany: async function updateMany({ tag, idList, salePrice, saleQuantity }) {
    try {
      const data = await wx.cloud.models.fh_cart.updateMany({
        data: {
          ...(salePrice != null && { salePrice }),
          ...(saleQuantity != null && { saleQuantity }),
        },
        filter: {
          where: {
            $and: [{ _id: { $in: idList } }],
          },
        },
      });
      log.info(tag, 'cart-updateMany', data);
      return data;
    } catch (error) {
      log.error(tag, 'cart-updateMany', error);
      throw error;
    }
  },
};
