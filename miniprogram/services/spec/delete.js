import cache from './cache';
import log from '../../common/log/log';

export async function deleteSpec({ tag, id }) {
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
}
export async function deleteMany({ tag, ids }) {
  if (ids.length === 1) {
    log.info(tag, 'spec-deleteMany', 'use delete instead');
    const id = ids[0];
    const res = this.deleteSpec({ tag, id });
    return [res];
  }
  try {
    const res = await Promise.all(ids.map((id) => this.deleteSpec({ tag, id })));
    log.info(tag, 'spec-deleteMany', ids, res);
    return res;
  } catch (error) {
    log.error(tag, 'spec-deleteMany', error);
  }
}
