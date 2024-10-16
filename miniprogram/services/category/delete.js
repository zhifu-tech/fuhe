import log from '../../common/log/log';
import cache from './cache';

export default async function ({ tag, saasId, id }) {
  try {
    const { data } = await wx.cloud.models.fh_category.delete({
      filter: {
        where: {
          _id: { $eq: id },
        },
      },
    });
    log.info(tag, 'category-delete', data);
    cache.deleteCategory(saasId, id);
    return data;
  } catch (error) {
    log.error(tag, 'category-delete', error);
    throw error;
  }
}
