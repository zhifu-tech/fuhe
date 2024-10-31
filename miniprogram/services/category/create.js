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
    log.info(tag, 'category-create', data);
    return data;
  } catch (error) {
    log.error(tag, 'category-create', error);
    throw error;
  }
}
