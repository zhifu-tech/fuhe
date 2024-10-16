import cache from './cache';
import log from '../../common/log/log';
import services from '../index';

export async function update({ tag, cId, id, title }) {
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
}

export async function updateMany({ tag, cId, infoList }) {
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
}
