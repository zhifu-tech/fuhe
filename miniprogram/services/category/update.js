import log from '@/common/log/log';

export default async function ({ tag, _id, title }) {
  try {
    const res = await wx.cloud.models.fh_category.update({
      data: {
        title,
      },
      filter: {
        where: {
          _id: { $eq: _id },
        },
      },
    });
    log.info(tag, 'category-update', res, title);
    return res;
  } catch (error) {
    log.error(tag, 'category-update', error);
    throw error;
  }
}
