import log from '@/common/log/log';
import services from '../index';

export async function create({ tag, sId, title }) {
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
    const option = {
      _id: data.id,
      sId,
      title,
    };
    log.info(tag, 'spec-option-create', title, data, option);
    return option;
  } catch (error) {
    log.error(tag, 'spec-option-create', error);
    throw error;
  }
}

export async function createMany({ tag, infoList }) {
  if (infoList.length === 1) {
    log.info(tag, 'spec-option-createMany', 'use create instead');
    const { sId, title } = infoList[0];
    const spec = await this.create({ tag, sId, title });
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
      const option = { _id: id, sId, title };
      cache.setSpecOption({ sId, option });
      return option;
    });
    log.info(tag, 'spec-option-createMany', infoList, data, options);
    return options;
  } catch (error) {
    log.error(tag, 'spec-option-createMany', error);
    throw error;
  }
}
