import log from '@/common/log/log';

export async function deleteOption({ tag, _id }) {
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
}
export async function deleteMany({ tag, _idList }) {
  if (ids.length === 1) {
    const res = await this.deleteOption({ tag, _id: _idList[0] });
    return [res];
  }
  try {
    const res = await Promise.all(_idList.map((_id) => this.deleteOption({ tag, _id })));
    log.info(tag, 'spec-option-deleteMany', _idList, res);
    return res;
  } catch (error) {
    log.error(tag, 'spec-deleteMany', error);
  }
}
