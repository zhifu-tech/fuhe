import log from '@/common/log/log';
import { saasId } from '@/common/saas/saas';

export default {
  _createParam: ({ title }) => ({
    // 商户信息
    saasId: saasId(),
    // 分类信息
    title,
    disabled: 0,
  }),
  _selectParam: () => ({
    _id: true,
    saasId: true,
    // 分类信息
    title: true,
  }),
  create: async function ({ tag, title }) {
    try {
      const { data } = await wx.cloud.models.fh_category.create({
        data: this._createParam({ title }),
      });
      log.info(tag, 'categroy-create', data);
      return data.id;
    } catch (e) {
      log.info(tag, 'categroy-create error', e);
      throw e;
    }
  },
  get: async function ({ tag, _id }) {
    try {
      const { data } = await wx.cloud.models.fh_category.get({
        data: this._selectParam(),
        filter: {
          where: {
            $and: [{ _id: { $eq: _id } }],
          },
        },
      });
      log.info(tag, 'category-get', data);
      return data;
    } catch (e) {
      log.error(tag, 'category-get', e);
      throw e;
    }
  },
  list: async function ({ tag, pageNumber }) {
    try {
      const { data } = await wx.cloud.models.fh_category.list({
        select: this._selectParam(),
        filter: {
          where: {
            $and: [
              { disabled: { $eq: 0 } }, //
              { saasId: { $eq: saasId() } },
            ],
          },
        },
        getCount: true,
        pageNumber,
        pageSize: 200,
      });
      log.info(tag, 'category-list', data);
      return data;
    } catch (error) {
      log.error(tag, 'category-list', error);
      throw error;
    }
  },
  all: async function ({ tag }) {
    let pageNumber = 0;
    let results = [];
    let totals = 0;
    do {
      ++pageNumber;
      const { records, total } = await this.list({ tag, pageNumber });
      totals = total;
      results = [...results, ...records];
    } while (results.length < totals);

    log.info(tag, 'category-all', totals, results.length);
    return {
      records: results,
      total: results.length,
    };
  },
  update: async function ({ tag, _id, title }) {
    try {
      const data = await wx.cloud.models.fh_category.update({
        data: {
          title,
        },
        filter: {
          where: {
            $and: [{ _id: { $eq: _id } }],
          },
        },
      });
      log.info(tag, 'category-update', title);
      return data;
    } catch (e) {
      log.error(tag, 'category-update', title, e);
    }
  },
  delete: async function ({ tag, _id, title }) {
    try {
      const { data } = await wx.cloud.models.fh_category.delete({
        filter: {
          where: {
            $and: [{ _id: { $eq: _id } }],
          },
        },
      });
      log.info(tag, 'category-delete', title, data);
      return data;
    } catch (error) {
      log.error(tag, 'category-delete', title, error);
      throw error;
    }
  },
};
