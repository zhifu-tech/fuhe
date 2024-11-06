import log from '@/common/log/log';

export async function deleteSpec({ tag, _id }) {
  try {
    const { data } = await wx.cloud.models.fh_spec.delete({
      filter: {
        where: {
          _id: { $eq: _id },
        },
      },
    });
    log.info(tag, 'spec-delete', data);
    return data;
  } catch (error) {
    log.error(tag, 'spec-delete', error);
    throw error;
  }
}
export async function deleteMany({ tag, _ids }) {
  if (_ids.length === 1) {
    const res = deleteSpec({ tag, _id: _ids[0] });
    return [res];
  }
  try {
    const res = await Promise.all(_ids.map((_id) => deleteSpec({ tag, _id })));
    log.info(tag, 'spec-deleteMany', _ids, res);
    return res;
  } catch (error) {
    log.error(tag, 'spec-deleteMany', error);
  }
}
