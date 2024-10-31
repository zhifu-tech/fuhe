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
    log.info(tag, 'category-get', data);
    return {
      _id: data._id,
      title: data.title,
    };
  } catch (error) {
    log.error(tag, 'category-get', error);
    throw error;
  }
}
