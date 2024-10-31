import log from '@/common/log/log';

export async function update({ tag, sId, _id, title }) {
  try {
    const { data } = await wx.cloud.models.fh_spec_option.update({
      data: {
        title,
      },
      filter: {
        where: {
          _id: { $eq: _id },
        },
      },
    });
    log.info(tag, 'spec-option-update', data);
    return data;
  } catch (error) {
    log.error(tag, 'spec-option-update', error);
    throw error;
  }
}
export async function updateMany({ tag, infoList }) {
  if (infoList.length === 1) {
    const { sId, _id, title } = infoList[0];
    const data = await update({ tag, sId, _id, title });
    return [data];
  }
  try {
    const data = await Promise.all(
      infoList.map(({ sId, _id, title }) => this.update({ tag, sId, _id, title })),
    );
    log.info(tag, 'spec-opton-updateMany', data);
    return data;
  } catch (error) {
    log.error(tag, 'spec-opton-updateMany', error);
    throw error;
  }
}
