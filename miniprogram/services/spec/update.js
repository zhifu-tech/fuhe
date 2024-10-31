import log from '@/common/log/log';

export async function update({ tag, _id, title }) {
  try {
    const { data } = await wx.cloud.models.fh_spec.update({
      data: {
        title,
      },
      filter: {
        where: {
          _id: { $eq: _id },
        },
      },
    });
    log.info(tag, 'spec-update', data);
    return data;
  } catch (error) {
    log.error(tag, 'spec-update', error);
    throw error;
  }
}

export async function updateMany({ tag, specList }) {
  if (specList.length === 1) {
    const { _id, title } = specList[0];
    await update({ tag, _id, title });
    return;
  }
  try {
    await Promise.all(
      specList.map(({ _id, title }) => {
        return update({ tag, _id, title });
      }),
    );
    log.info(tag, 'spec-updateMany');
    return;
  } catch (error) {
    log.error(tag, 'spec-updateMany', error);
    throw error;
  }
}
