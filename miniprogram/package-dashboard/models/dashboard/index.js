import dayjs from 'dayjs';
import log from '@/common/log/log';

export default {
  // 同步小店数据
  getStoreData: async function ({ tag, syncTime }) {
    try {
      const _syncTime = _getSyncTime(syncTime);
      const { data } = await wx.cloud.models.fh_dashboard.get({
        select: {
          _id: true,
          syncTime: true,
          goodsTotal: true,
          orderTotal: true,
          entityTotal: true,
        },
        filter: {
          where: {
            $and: [{ syncTime: { $eq: _syncTime } }],
          },
        },
      });
      log.info(tag, 'getStoreData', data);
      data.syncTimeFormatted = _formatSyncTime(data.syncTime);
      return data;
    } catch (error) {
      log.error(tag, 'get', error);
      throw error;
    }
  },

  setStoreData: async function ({
    tag, //
    syncTime,
    goodsTotal,
    orderTotal,
    entityTotal,
  }) {
    try {
      const _syncTime = _getSyncTime(syncTime);
      const { data } = await wx.cloud.models.fh_dashboard.create({
        data: {
          syncTime: _syncTime,
          goodsTotal,
          orderTotal,
          entityTotal,
        },
      });
      log.info(tag, 'setStoreData', data);
      return {
        syncTime,
        syncTimeFormatted: _formatSyncTime(_syncTime),
        goodsTotal,
        orderTotal,
        entityTotal,
      };
    } catch (error) {
      log.error(tag, 'get', error);
      throw error;
    }
  },
  // 获取收入数据
  getIncomeHourData: async function ({ tag, startTimeMs, endTimeMs }) {
    try {
      const { data } = await wx.cloud.models.fh_income_hour.list({
        select: {
          _id: true,
          syncTime: true,
          profit: true,
          cost: true,
          income: true,
        },
        filter: {
          where: {
            $and: [
              { syncTime: { $gte: startTimeMs } }, //
              { syncTime: { $lt: endTimeMs } },
            ],
          },
        },
        orderby: [{ syncTime: 'desc' }],
      });
      log.info(
        tag,
        'getIncomeHourData',
        data,
        dayjs(startTimeMs).format('YYYY-MM-DD HH:mm:ss'),
        dayjs(endTimeMs).format('YYYY-MM-DD HH:mm:ss'),
      );
      return data;
    } catch (error) {
      log.error(tag, 'getIncomeHourData', error);
      throw error;
    }
  },
  setIncomeHourData: async function ({ tag, records }) {
    try {
      const { data } = await wx.cloud.models.fh_income_hour.createMany({
        data: records.map(({ syncTime, profit, cost, income }) => ({
          syncTime,
          profit,
          cost,
          income,
        })),
      });
      log.info(tag, 'setIncomeHourData', data);
      return data;
    } catch (error) {
      log.error(tag, 'setIncomeHourData', error);
      throw error;
    }
  },
  // 获取收入数据
  getIncomeDayData: async function ({ tag, startTimeMs, endTimeMs }) {
    try {
      const { data } = await wx.cloud.models.fh_income_day.list({
        select: {
          _id: true,
          syncTime: true,
          profit: true,
          cost: true,
          income: true,
        },
        filter: {
          where: {
            $and: [
              { syncTime: { $gte: startTimeMs } }, //
              { syncTime: { $lt: endTimeMs } },
            ],
          },
        },
        orderby: [{ syncTime: 'desc' }],
      });
      log.info(
        tag,
        'getIncomeDayData',
        data,
        dayjs(startTimeMs).format('YYYY-MM-DD HH:mm:ss'),
        dayjs(endTimeMs).format('YYYY-MM-DD HH:mm:ss'),
      );
      return data;
    } catch (error) {
      log.error(tag, 'getIncomeDayData', error);
      throw error;
    }
  },
  setIncomeDayData: async function ({ tag, records }) {
    try {
      const { data } = await wx.cloud.models.fh_income_day.createMany({
        data: records.map(({ syncTime, profit, cost, income }) => ({
          syncTime,
          profit,
          cost,
          income,
        })),
      });
      log.info(tag, 'setIncomeDayData', data);
      return data;
    } catch (error) {
      log.error(tag, 'setIncomeDayData', error);
      throw error;
    }
  },
  // 获取收入数据
  getIncomeMonthData: async function ({ tag, startTimeMs, endTimeMs }) {
    try {
      const { data } = await wx.cloud.models.fh_income_month.list({
        select: {
          _id: true,
          syncTime: true,
          profit: true,
          cost: true,
          income: true,
        },
        filter: {
          where: {
            $and: [
              { syncTime: { $gte: startTimeMs } }, //
              { syncTime: { $lt: endTimeMs } },
            ],
          },
        },
        orderby: [{ syncTime: 'desc' }],
      });
      log.info(
        tag,
        'getIncomeMonthData',
        data,
        dayjs(startTimeMs).format('YYYY-MM-DD HH:mm:ss'),
        dayjs(endTimeMs).format('YYYY-MM-DD HH:mm:ss'),
      );
      return data;
    } catch (error) {
      log.error(tag, 'getIncomeMonthData', error);
      throw error;
    }
  },
  setIncomeMonthData: async function ({ tag, records }) {
    try {
      const { data } = await wx.cloud.models.fh_income_month.createMany({
        data: records.map(({ syncTime, profit, cost, income }) => ({
          syncTime,
          profit,
          cost,
          income,
        })),
      });
      log.info(tag, 'setIncomeMonthData', data);
      return data;
    } catch (error) {
      log.error(tag, 'setIncomeMonthData', error);
      throw error;
    }
  },
};

function _getSyncTime(syncTime) {
  // 格式化syncTime为整点时间 syncTime为 ms 毫秒时间戳，计算其最接近的上一个整点时间
  return Math.floor(syncTime / 1000 / 60 / 60) * 1000 * 60 * 60;
}
function _formatSyncTime(syncTime) {
  // 格式化syncTime为整点时间 syncTime为 ms 毫秒时间戳，计算其最接近的上一个整点时间
  return dayjs(syncTime).format('YYYY-MM-DD HH:mm:ss');
}
