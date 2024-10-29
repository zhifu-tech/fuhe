import log from '../../common/log/log';

/**
 * Fetches a batch of stock records based on the provided SKU IDs and a tag.
 * The function paginates through the results until all matching records are fetched.
 *
 * @param {Object} params - The parameters object.
 * @param {string} params.tag - A tag for logging purposes.
 * @param {Array<string>} params.skuIdList - An array of SKU IDs to filter the stock records.
 * @returns {Promise<Object>} - A promise that resolves to an object containing the results and total count.
 * @throws {Error} - Throws an error if there is an issue fetching the stock records.
 */

export default async function ({ tag, skuIdList }) {
  try {
    let pageNumber = 0;
    let results = [];
    let totals = 0;
    do {
      ++pageNumber;
      const {
        data: { records, total },
      } = await wx.cloud.models.fh_stock.list({
        select: {
          _id: true,
          skuId: true,
          costPrice: true,
          originalPrice: true,
          salePrice: true,
          quantity: true,
          createdAt: true,
          updatedAt: true,
        },
        filter: {
          where: {
            $and: [{ skuId: { $in: skuIdList } }, { quantity: { $gt: 0 } }],
          },
        },
        orderBy: [{ skuId: 'asc' }, { createdAt: 'asc' }, { costPrice: 'asc' }],
        getCount: true,
        pageSize: 200,
        pageNumber,
      });
      totals = total;
      results = [...results, ...records];
    } while (results.length < totals);
    log.info(tag, 'stock-list-batch', results, totals === results.length);

    return { records: results, total: results.length };
  } catch (error) {
    log.error(tag, 'stock-list-batch', error);
    throw error;
  }
}
