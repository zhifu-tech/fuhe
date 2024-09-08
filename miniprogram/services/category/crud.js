import services from '../index';
import log from '../../utils/log';
import cache from './cache';

export default {
  create: async function ({ tag, saasId, title }) {
    try {
      const { data } = await wx.cloud.models.fh_category.create({
        data: {
          saasId,
          title,
          disabled: 0,
        },
      });
      const category = services.category.createCategory({
        id: data.id,
        saasId,
        title,
        disabled: 0,
      });
      cache.setCategory(saasId, category._id, category);
      log.info(tag, 'category-create', category);
      return category;
    } catch (error) {
      log.error(tag, 'category-create', error);
      throw error;
    }
  },
  get: async function ({ tag, saasId, id, loadFromCacheEnabled = true }) {
    if (loadFromCacheEnabled) {
      const cached = cache.getCategory(saasId, id);
      if (cached) {
        log.info(tag, 'getCategory', 'hit cached', cached);
        return cached;
      }
    }
    try {
      const { data } = await wx.cloud.models.fh_category.get({
        data: {
          _id: true,
          saasId: true,
          title: true,
        },
        filter: {
          where: {
            _id: { $eq: id },
          },
        },
      });
      log.info(tag, 'getCategory', 'load from cloud', data);
      cache.setCategory(saasId, id, data);
      return data;
    } catch (error) {
      log.error(tag, 'getCategory', error);
      throw error;
    }
  },
  list: async function ({ tag, saasId, pageNumber, loadFromCacheEnabled = true }) {
    if (loadFromCacheEnabled) {
      const cached = cache.getList(saasId, pageNumber);
      if (cached) {
        log.info(tag, 'listCategory', 'hit cached');
        return cached;
      }
    }
    try {
      const { data } = await wx.cloud.models.fh_category.list({
        select: {
          _id: true,
          saasId: true,
          title: true,
        },
        filter: {
          where: {
            $and: [
              {
                disabled: { $eq: 0 },
              },
              {
                saasId: { $eq: saasId },
              },
            ],
          },
        },
        getCount: true,
        pageNumber,
        pageSize: 200,
      });
      // 保存结果到缓存中
      cache.setList({ saasId, data });
      log.info(tag, 'category-list', 'load from cloud', data);
      return data;
    } catch (e) {
      log.error(tag, 'category-list', e);
      throw e;
    }
  },
  update: async function ({ tag, saasId, id, title }) {
    try {
      const res = await wx.cloud.models.fh_category.update({
        data: {
          title,
        },
        filter: {
          where: {
            id: { $eq: id },
          },
        },
      });
      // 更新缓存中的数据
      let category = cache.getCategory(saasId, id);
      if (category) {
        category.title = title;
      } else {
        category = services.category.createCategory({ id, saasId, title, disabled: '0' });
        cache.setCategory(saasId, id, category);
      }
      log.info(tag, 'category-update', res, title);
      return res;
    } catch (error) {
      log.error(tag, 'category-update', error);
      throw error;
    }
  },
  delete: async function ({ tag, saasId, id }) {
    try {
      const { data } = await wx.cloud.models.fh_category.delete({
        filter: {
          where: {
            _id: { $eq: id },
          },
        },
      });
      log.info(tag, 'category-delete', data);
      cache.deleteCategory(saasId, id);
      return data;
    } catch (error) {
      log.error(tag, 'category-delete', error);
      throw error;
    }
  },
};
