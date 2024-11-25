import log from '@/common/log/log';

export default {
  _createParam: ({ cId, title }) => ({
    // 分类
    cId,
    category: {
      _id: cId,
    },
    // 规格信息
    title,
  }),
  _createOptionParam: ({ sId, title }) => ({
    // 规格
    sId,
    spec: {
      _id: sId,
    },
    // 选项信息
    title,
  }),
  _selectParam: () => ({
    _id: true,
    // 分类
    cId: true,
    // 规格信息
    title: true,
    // 选项列表
    optionList: {
      _id: true,
      sId: true,
      title: true,
    },
  }),
  create: async function ({ tag, param }) {
    try {
      const { data } = await wx.cloud.models.fh_spec.create({
        data: this._createParam(param),
      });
      log.info(tag, 'spec-create', data);
      return data.id;
    } catch (error) {
      log.error(tag, 'spec-create', error);
      throw error;
    }
  },
  createMany: async function ({ tag, paramList }) {
    try {
      const { data } = await wx.cloud.models.fh_spec.createMany({
        data: paramList.map(this._createParam),
      });
      log.info(tag, 'spec-createMany', data);
      return data.idList;
    } catch (error) {
      log.error(tag, 'spec-createMany', error);
      throw error;
    }
  },
  createOption: async function ({ tag, sId, title }) {
    try {
      const { data } = await wx.cloud.models.fh_spec_option.create({
        data: this._createOptionParam({ sId, title }),
      });
      log.info(tag, 'spec-option-create', data);
      return data.id;
    } catch (error) {
      log.error(tag, 'spec-option-create', error);
      throw error;
    }
  },
  createOptionMany: async function ({ tag, infoList }) {
    try {
      const { data } = await wx.cloud.models.fh_spec_option.createMany({
        data: infoList.map(this._createOptionParam),
      });
      log.info(tag, 'spec-option-createMany', data);
      return data.idList;
    } catch (error) {
      log.error(tag, 'spec-option-createMany', error);
      throw error;
    }
  },
  list: async function ({ tag, cId }) {
    try {
      const { data } = await wx.cloud.models.fh_spec.list({
        select: this._selectParam({
          withOptionList: true,
        }),
        filter: {
          where: {
            $and: [{ cId: { $eq: cId } }],
          },
        },
        getCount: true,
        pageNumber: 1,
        pageSize: 200,
      });
      log.info(tag, 'spec-list', data);
      return data;
    } catch (error) {
      log.error(tag, 'spec-list', error);
      throw error;
    }
  },
  listBatch: async function ({ tag, cIdList }) {
    try {
      let pageNumber = 0;
      let results = [];
      let totals = 0;
      do {
        ++pageNumber;
        const {
          data: { records, total },
        } = await wx.cloud.models.fh_spec.list({
          select: this._selectParam({
            withOptionList: true,
          }),
          filter: {
            where: {
              $and: [{ cId: { $in: cIdList } }],
            },
          },
          orderBy: [{ cId: 'asc' }],
          getCount: true,
          pageSize: 200,
          pageNumber,
        });
        totals = total;
        results = [...results, ...records];
      } while (results.length < totals);

      // 将连续的results，按照cId进行分段，并添加到 map中
      const specListMap = new Map();
      for (let i = 0, j = 0; j < results.length; i = j) {
        const cId = results[i].cId;
        while (j < results.length && results[j].cId === cId) j++;
        specListMap.set(cId, results.slice(i, j));
      }
      log.info(tag, 'spec-list-batch', totals, specListMap.size);
      return specListMap;
    } catch (error) {
      log.error(tag, 'spec-list-batch', error);
      throw error;
    }
  },
  update: async function ({ tag, _id, title }) {
    try {
      const { data } = await wx.cloud.models.fh_spec.update({
        data: { title },
        filter: {
          where: {
            $and: [{ _id: { $eq: _id } }],
          },
        },
      });
      log.info(tag, 'spec-update', data);
      return data;
    } catch (error) {
      log.error(tag, 'spec-update', error);
      throw error;
    }
  },
  updateMany: async function ({ tag, speckList }) {
    try {
      await Promise.all(
        speckList.map(({ _id, title }) => {
          return this.update({ tag, _id, title });
        }),
      );
      log.info(tag, 'spec-updateMany');
      return;
    } catch (error) {
      log.error(tag, 'spec-updateMany', error);
      throw error;
    }
  },
  deleteSpec: async function ({ tag, _id }) {
    try {
      const { data } = await wx.cloud.models.fh_spec.delete({
        filter: {
          where: {
            $and: [{ _id: { $eq: _id } }],
          },
        },
      });
      log.info(tag, 'spec-delete', data);
      return data;
    } catch (error) {
      log.error(tag, 'spec-delete', error);
      throw error;
    }
  },
  updateOption: async function ({ tag, _id, title }) {
    try {
      const { data } = await wx.cloud.models.fh_spec_option.update({
        data: {
          title,
        },
        filter: {
          where: {
            $and: [{ _id: { $eq: _id } }],
          },
        },
      });
      log.info(tag, 'spec-option-update', data, title);
      return data;
    } catch (error) {
      log.error(tag, 'spec-option-update', error);
      throw error;
    }
  },
  updateOptionMany: async function ({ tag, infoList }) {
    try {
      const data = await Promise.all(
        infoList.map(({ _id, title }) => {
          return this.updateOption({ tag, _id, title });
        }),
      );
      log.info(tag, 'spec-opton-updateMany', data);
      return data;
    } catch (error) {
      log.error(tag, 'spec-opton-updateMany', error);
      throw error;
    }
  },
  deleteMany: async function ({ tag, _ids }) {
    try {
      const res = await Promise.all(
        _ids.map((_id) => {
          return this.deleteSpec({ tag, _id });
        }),
      );
      log.info(tag, 'spec-deleteMany', _ids, res);
      return res;
    } catch (error) {
      log.error(tag, 'spec-deleteMany', error);
    }
  },
  deleteOption: async function ({ tag, _id }) {
    try {
      const { data } = await wx.cloud.models.fh_spec_option.delete({
        filter: {
          where: {
            _id: { $eq: _id },
          },
        },
      });
      log.info(tag, 'spec-option-delete', data);
      return data;
    } catch (error) {
      log.error(tag, 'spec-option-delete', error);
      throw error;
    }
  },
  deleteOptionMany: async function ({ tag, infoList }) {
    try {
      const data = await Promise.all(
        infoList.map(({ _id }) => {
          return this.deleteOption({ tag, _id });
        }),
      );
      log.info(tag, 'spec-option-deleteMany', data);
      return data;
    } catch (error) {
      log.error(tag, 'spec-deleteMany', error);
    }
  },
};
