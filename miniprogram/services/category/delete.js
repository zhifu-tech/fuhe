import log from '@/common/log/log';

export default async function ({ tag, _id }) {
  try {
    const { data } = await wx.cloud.models.fh_category.delete({
      filter: {
        where: {
          $and: [
            {
              _id: { $eq: _id },
            },
          ],
        },
      },
    });
    log.info(tag, 'category-delete', data);
    return data;
  } catch (error) {
    log.error(tag, 'category-delete', error);
    throw error;
  }
}
