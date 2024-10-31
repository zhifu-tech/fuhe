import log from '@/common/log/log';

export async function create({ tag, cId, title }) {
  try {
    const { data } = await wx.cloud.models.fh_spec.create({
      data: {
        cId,
        title,
      },
    });
    log.info(tag, 'spec-create', data);
    return data.id;
  } catch (error) {
    log.error(tag, 'spec-create', error);
    throw error;
  }
}

export async function createMany({ tag, cId, titles }) {
  log.info(
    tag,
    'spec-createMany',
    titles.map((title) => ({
      cId,
      title: title,
    })),
  );
  try {
    const { data } = await wx.cloud.models.fh_spec.createMany({
      data: titles.map((title) => ({
        cId,
        title,
      })),
    });
    log.info(tag, 'spec-createMany', titles, data);
    return data.idList;
  } catch (error) {
    log.error(tag, 'spec-createMany', error);
    throw error;
  }
}
