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
export async function deleteMany({ tag, infoList }) {
  if (infoList.length === 1) {
    const { _id } = infoList[0];
    const data = await deleteOption({ tag, _id });
    return [data];
  }
  try {
    const data = await Promise.all(
      infoList.map(({ _id }) => {
        return deleteOption({ tag, _id });
      }),
    );
    log.info(tag, 'spec-option-deleteMany', data);
    return data;
  } catch (error) {
    log.error(tag, 'spec-deleteMany', error);
  }
}
