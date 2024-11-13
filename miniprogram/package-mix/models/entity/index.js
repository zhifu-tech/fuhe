import log from '@/common/log/log';
import { saasId } from '@/common/saas/saas';

export default {
  list: async function ({ tag, pageNumber, pageSize = 200 }) {
    try {
      const { data } = await wx.cloud.models.fh_entity.list({
        select: {
          _id: true,
          name: true,
          signature: true,
          tel: true,
          type: true,
          contacts: true,
          contacts2: true,
        },
        filter: {
          where: {
            $and: [
              {
                saasId: { $eq: saasId() },
              },
            ],
          },
        },
        pageSize,
        pageNumber,
        getCount: true,
      });
      log.info(tag, 'entity-list', data);
      return data;
    } catch (e) {
      log.error(tag, 'entity-list', e);
      throw e;
    }
  },
  all: async function ({ tag }) {
    try {
      let pageNumber = 0;
      let results = [];
      let totals = 0;
      do {
        ++pageNumber;
        const { records, total } = await this.list({ tag, pageNumber });
        totals = total;
        results = [...results, ...records];
      } while (results.length < totals);

      log.info(tag, 'entity-all', totals, results);
      return { records: results, total: results.length };
    } catch (error) {
      log.error(tag, 'entity-all', error);
      throw error;
    }
  },
};
