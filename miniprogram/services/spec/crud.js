import cache from './cache';
import log from '../../utils/log';
import services from '../index';

export default {
  create: async function ({ tag, cId, title }) {
    try {
      const { data } = await wx.cloud.models.fh_spec.create({
        data: {
          cId,
          title,
        },
      });
      const { id } = data;
      const spec = services.spec.createSpecObject({ id, cId, title });
      cache.setSpec(id, spec);
      log.info(tag, 'spec-create', title, data, spec);
      return spec;
    } catch (error) {
      log.error(tag, 'spec-create', error);
      throw error;
    }
  },
  createMany: async function ({ tag, cId, titles }) {
    if (titles.length === 1) {
      log.info(tag, 'spec-createMany', 'use create instead');
      const { title } = titles[0];
      const spec = await this.create({ tag, cId, title });
      return [spec];
    }
    try {
      const { data } = await wx.cloud.models.fh_spec.createMany({
        data: titles.map(({ title }) => ({
          cId,
          title,
        })),
      });
      const { idList } = data;
      const specs = idList.map((id, index) => {
        const title = titles[index];
        const spec = services.spec.createSpecObject({ id, cId, title });
        cache.setSpec(id, spec);
        return spec;
      });
      log.info(tag, 'spec-createMany', titles, data, specs);
      return specs;
    } catch (error) {
      log.error(tag, 'spec-createMany', error);
      throw error;
    }
  },
  list: async function ({ tag, cId, loadFromCacheEnabled = true }) {
    if (loadFromCacheEnabled) {
      const cached = cache.getList(cId);
      if (cached) {
        log.info(tag, 'spec-list', 'hit cached', cached);
        return cached;
      }
    }
    try {
      const { data } = await wx.cloud.models.fh_spec.list({
        select: {
          _id: true,
          cId: true,
          title: true,
          options: {
            _id: true,
            sId: true,
            title: true,
          },
        },
        filter: {
          where: {
            cId: { $eq: cId },
          },
        },
        getCount: true,
        pageNumber: 1,
        pageSize: 200,
      });
      cache.setList(cId, data);
      log.info(tag, 'spec-list', data);
      return data;
    } catch (error) {
      log.error(tag, 'spec-list', error);
      throw error;
    }
  },
  update: async function ({ tag, cId, id, title }) {
    try {
      const { data } = await wx.cloud.models.fh_spec.update({
        data: {
          title,
        },
        filter: {
          where: {
            _id: { $eq: id },
          },
        },
      });
      let spec = cache.getSpec(id);
      if (spec) {
        spec.title = title;
      } else {
        spec = services.spec.createSpecObject({ id, cId, title });
        cache.setSpec(id, spec);
      }
      log.info(tag, 'spec-update', title, data, spec);
      return spec;
    } catch (error) {
      log.error(tag, 'spec-update', error);
      throw error;
    }
  },
  updateMany: async function ({ tag, cId, infoList }) {
    if (infoList.length === 1) {
      log.info(tag, 'spec-updateMany', 'use update instead');
      const { id, title } = infoList[0];
      const specs = await this.update({ tag, cId, id, title });
      return [specs];
    }
    try {
      const specs = await Promise.all(
        infoList.map(({ id, title }) => this.update({ tag, id, title })),
      );
      log.info(tag, 'spec-updateMany', specs);
      return specs;
    } catch (error) {
      log.error(tag, 'spec-updateMany', error);
      throw error;
    }
  },
  delete: async function ({ tag, id }) {
    try {
      const { data } = await wx.cloud.models.fh_spec.delete({
        filter: {
          where: {
            _id: { $eq: id },
          },
        },
      });
      cache.deleteSpec(id);
      log.info(tag, 'spec-delete', data);
      return data;
    } catch (error) {
      log.error(tag, 'spec-delete', error);
      throw error;
    }
  },
  deleteMany: async function ({ tag, ids }) {
    if (ids.length === 1) {
      log.info(tag, 'spec-deleteMany', 'use delete instead');
      const id = ids[0];
      const res = this.delete({ tag, id });
      return [res];
    }
    try {
      const res = await Promise.all(ids.map((id) => this.delete({ tag, id })));
      log.info(tag, 'spec-deleteMany', ids, res);
      return res;
    } catch (error) {
      log.error(tag, 'spec-deleteMany', error);
    }
  },
  createOption: async function ({ tag, sId, title }) {
    try {
      const { data } = await wx.cloud.models.fh_spec_option.create({
        data: {
          sId,
          title,
          spec: {
            _id: sId,
          },
        },
      });
      const { id } = data;
      const option = services.spec.createSpecOptionObject({ id, sId, title });
      cache.setSpec({ sId, option });
      log.info(tag, 'spec-option-create', title, data, option);
      return option;
    } catch (error) {
      log.error(tag, 'spec-option-create', error);
      throw error;
    }
  },
  createOptionMany: async function ({ tag, infoList }) {
    if (infoList.length === 1) {
      log.info(tag, 'spec-option-createMany', 'use create instead');
      const { sId, title } = infoList[0];
      const spec = await this.createOption({ tag, sId, title });
      return [spec];
    }
    try {
      const { data } = await wx.cloud.models.fh_spec_option.createMany({
        data: infoList.map(({ sId, title }) => ({
          sId,
          title,
          spec: {
            _id: sId,
          },
        })),
      });
      const { idList } = data;
      const options = idList.map((id, index) => {
        const { sId, title } = infoList[index];
        const option = services.spec.createSpecOptionObject({ id, sId, title });
        cache.setSpec(sId, option);
        return option;
      });
      log.info(tag, 'spec-option-createMany', infoList, data, options);
      return options;
    } catch (error) {
      log.error(tag, 'spec-option-createMany', error);
      throw error;
    }
  },
  updateOption: async function ({ tag, sId, id, title }) {
    try {
      const { data } = await wx.cloud.models.fh_spec_option.update({
        data: {
          title,
        },
        filter: {
          where: {
            _id: { $eq: id },
          },
        },
      });
      let option = cache.getSpecOption({ sId, id });
      if (option) {
        option.title = title;
      } else {
        option = services.spec.createSpecOptionObject({ id, sId, title });
        cache.setSpecOption(id, option);
      }
      log.info(tag, 'spec-option-update', title, data, option);
      return option;
    } catch (error) {
      log.error(tag, 'spec-option-update', error);
      throw error;
    }
  },
  updateOptionsMany: async function ({ tag, infoList }) {
    if (infoList.length === 1) {
      log.info(tag, 'spec-opton-updateMany', 'use update instead');
      const { sId, id, title } = infoList[0];
      const option = await this.update({ tag, sId, id, title });
      return [option];
    }
    try {
      const options = await Promise.all(
        infoList.map(({ sId, id, title }) => this.update({ tag, sId, id, title })),
      );
      log.info(tag, 'spec-opton-updateMany', options);
      return options;
    } catch (error) {
      log.error(tag, 'spec-opton-updateMany', error);
      throw error;
    }
  },
  deleteOption: async function ({ tag, sId, id }) {
    try {
      const { data } = await wx.cloud.models.fh_spec_option.delete({
        filter: {
          where: {
            _id: { $eq: id },
          },
        },
      });
      cache.deleteSpecOption({ sId, id });
      log.info(tag, 'spec-option-delete', data);
      return data;
    } catch (error) {
      log.error(tag, 'spec-option-delete', error);
      throw error;
    }
  },
  deleteOptionMany: async function ({ tag, ids }) {
    if (ids.length === 1) {
      log.info(tag, 'spec-option-deleteMany', 'use delete instead');
      const { sId, id } = ids[0];
      const res = await this.deleteOption({ tag, sId, id });
      return [res];
    }
    try {
      const res = await Promise.all(ids.map(({ sId, id }) => this.deleteOption({ tag, sId, id })));
      log.info(tag, 'spec-option-deleteMany', ids, res);
      return res;
    } catch (error) {
      log.error(tag, 'spec-deleteMany', error);
    }
  },
};
