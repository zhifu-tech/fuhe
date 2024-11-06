import log from '@/common/log/log';

export default async function ({ tag, _id, title }) {
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
    log.info(tag, 'category-delete', title, data);
    return data;
  } catch (error) {
    log.error(tag, 'category-delete', title, error);
    throw error;
  }
}
