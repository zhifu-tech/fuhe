import log from '@/common/log/log';
import { saasId } from '@/common/saas/saas';

export default {
  create: async function ({ tag, spuId, skuId, stockId, salePrice, saleQuantity }) {
    try {
      const { data } = await wx.cloud.models.fh_cart.create({
        data: {
          saasId: saasId(),
          spuId,
          skuId,
          stockId,
          salePrice,
          saleQuantity,
        },
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
        data: infoList.map(({ spuId, skuId, stockId, salePrice, saleQuantity }) => ({
          saasId: saasId(),
          spuId,
          skuId,
          stockId,
          salePrice,
          saleQuantity,
        })),
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
        select: _selectData(),
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
        select: _selectData(),
        filter: {
          where: {
            $and: [{ saasId: { $eq: saasId() } }],
          },
        },
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
    const data = await wx.cloud.models.fh_cart.updateMany({
      data: {
        salePrice,
        saleQuantity,
      },
      filter: {
        where: {
          _id: { $in: idList },
        },
      },
    });
    return data;
  },
};

const _selectData = () => ({
  _id: true,
  saasId: true,
  spuId: true,
  skuId: true,
  stockId: true,
  salePrice: true,
  saleQuantity: true,
  createAt: true,
  updateAt: true,
});
