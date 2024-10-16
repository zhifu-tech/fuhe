import cache from '../spec/cache';
import log from '../../common/log/log';
import services from '../index';

export async function update({ tag, sId, id, title }) {
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
}
export async function updateMany({ tag, infoList }) {
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
}
