import log from '@/common/log/log';

export default async function ({ tag, saasId, title }) {
  try {
    const { data } = await wx.cloud.models.fh_category.create({
      data: {
        saasId,
        title,
        disabled: 0,
      },
    });
    log.info(tag, 'categroy-create', data);
    return data.id;
  } catch (e) {
    log.info(tag, 'categroy-create error', e);
    throw e;
  }
}
