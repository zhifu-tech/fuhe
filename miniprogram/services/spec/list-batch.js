import log from '../../common/log/log';

/**
 * Fetches a batch of product records based on the provided category IDs and a tag.
 * The function paginates through the results until all matching records are fetched.
 *
 * @param {Object} params - The parameters object.
 * @param {string} params.tag - A tag for logging purposes.
 * @param {Array<string>} params.categoryIdList - An array of category IDs to filter the product records.
 * @returns {Promise<Object>} - A promise that resolves to an object containing the results and total count.
 * @throws {Error} - Throws an error if there is an issue fetching the product records.
 */
export default async function ({ tag, cIdList }) {
  try {
    let pageNumber = 0;
    let results = [];
    let totals = 0;
    do {
      ++pageNumber;
      const {
        data: { records, total },
      } = await wx.cloud.models.fh_spec.list({
        select: {
          _id: true,
          cId: true,
          title: true,
          optionList: {
            _id: true,
            sId: true,
            title: true,
          },
        },
        filter: {
          where: {
            $and: [{ cId: { $in: cIdList } }],
          },
        },
        orderBy: [{ cId: 'asc' }],
        getCount: true,
        pageSize: 200,
        pageNumber,
      });
      totals = total;
      results = [...results, ...records];
    } while (results.length < totals);
    log.info(tag, 'spec-list-batch', totals === results.length);

    return { records: results, total: results.length };
  } catch (error) {
    log.error(tag, 'spec-list-batch', error);
    throw error;
  }
}
