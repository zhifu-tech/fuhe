import log from '@/common/log/log';

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
    log.info(tag, 'spec-option-create', data);
    return data.id;
  } catch (error) {
    log.error(tag, 'spec-option-create', error);
    throw error;
  }
}

export async function createMany({ tag, infoList }) {
  if (infoList.length === 1) {
    const { sId, title } = infoList[0];
    const id = await create({ tag, sId, title });
    return [id];
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
    log.info(tag, 'spec-option-createMany', data);
    return data.idList;
  } catch (error) {
    log.error(tag, 'spec-option-createMany', error);
    throw error;
  }
}
