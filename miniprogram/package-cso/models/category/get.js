import log from '@/common/log/log';

export default async function ({ tag, _id }) {
  try {
    const { data } = await wx.cloud.models.fh_category.get({
      data: {
        _id: true,
        title: true,
      },
      filter: {
        where: {
          _id: { $eq: _id },
        },
      },
    });
    const category = {
      _id: data._id,
      title: data.title,
    };
    log.info(tag, 'category-get', category.title);
    return category;
  } catch (e) {
    log.error(tag, 'category-get', e);
    throw e;
  }
}
