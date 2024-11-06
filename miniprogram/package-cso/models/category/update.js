import log from '@/common/log/log';
export default async function ({ tag, _id, title }) {
  try {
    const data = await wx.cloud.models.fh_category.update({
      data: {
        title,
      },
      filter: {
        where: {
          _id: { $eq: _id },
        },
      },
    });
    log.info(tag, 'category-update', title);
    return data;
  } catch (e) {
    log.error(tag, 'category-update', title, e);
  }
}
