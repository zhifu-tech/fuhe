import log from '@/common/log/log';

export async function deleteOption({ tag, sId, id }) {
  try {
    const { data } = await wx.cloud.models.fh_spec_option.delete({
      filter: {
        where: {
          _id: { $eq: id },
        },
      },
    });
    log.info(tag, 'spec-option-delete', data);
    return data;
  } catch (error) {
    log.error(tag, 'spec-option-delete', error);
    throw error;
  }
}
export async function deleteMany({ tag, ids }) {
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
}
