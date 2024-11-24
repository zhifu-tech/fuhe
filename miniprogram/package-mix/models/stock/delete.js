import log from '@/common/log/log';

export default async function ({ tag, _id }) {
  try {
    const { data } = await wx.cloud.models.fh_stock.delete({
      filter: {
        where: {
          $and: [{ _id: { $eq: _id } }],
        },
      },
    });
    log.info(tag, 'stock-delete', data);
    return data;
  } catch (error) {
    log.error(tag, 'stock-delete', error);
    throw error;
  }
}
