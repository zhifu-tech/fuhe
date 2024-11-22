import { action, observable } from 'mobx-miniprogram';
import log from '../../../common/log/log';
import dayjs from 'dayjs';

export default (function () {
  const tagStore = 'store-dashboard';
  return observable({
    // 小店数据
    storeData: observable({
      syncInterval: 60 * 60 * 1000, // 同步间隔 60分钟
      syncTime: 0, // 同步时间
      syncTimeFormatted: '', // 同步时间格式化
      goodsTotal: 0, // 商品总数
      orderTotal: 0, // 订单总数
      entityTotal: 0, // 实体总数

      get syncTimeFormatted() {
        return dayjs(this.syncTime).format('YYYY-MM-DD HH:mm:ss');
      },
    }),
    // 收入数据
    incomeData: observable({
      syncInterval: 60 * 60 * 1000, // 同步间隔 60分钟
      syncTime: 0, // 同步时间
      active: 0,

      get selected() {
        return this.tags[this.active];
      },
      set selected(value) {
        this.active = value;
      },
      get syncTimeFormatted() {
        return dayjs(this.syncTime).format('YYYY-MM-DD HH:mm:ss');
      },
      get tags() {
        return [this.today, this.yesterday, this.week, this.month];
      },

      // 按日统计， 细分粒度为 4小时，4x6
      today: {
        title: '今天',
        data: [
          {
            profit: 0,
            cost: 0,
            income: 0,
          },
        ],
        xAxis: () => ['04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
      },
      // 按日统计， 细分粒度为 4小时，4X6
      yesterday: {
        title: '昨天',
        data: [],
        xAxis: () => ['04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
      },
      // 按周统计， 细分粒度为 天，七天
      week: {
        title: '本周',
        data: [],
        xAxis: () => ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      },
      // 按月统计， 细分粒度为 天，30天
      month: {
        title: '本月',
        data: [],
        xAxis: () => ['1号', '5号', '10号', '15号', '20号', '25号', '31号'],
      },
      // 按年统计，细分粒度为 月，12个月
      year: {
        title: '本年',
        data: [],
        xAxis: () => [
          '一月',
          '二月',
          '三月',
          '四月',
          '五月',
          '六月',
          '七月',
          '八月',
          '九月',
          '十月',
          '十一月',
          '十二月',
        ],
      },
    }),

    setStoreData: action(function ({
      tag, //
      syncTime,
      goodsTotal,
      orderTotal,
      entityTotal,
    }) {
      log.info(tag, tagStore, 'setStoreData', { syncTime, goodsTotal, orderTotal });
      this.storeData.syncTime = syncTime;
      this.storeData.goodsTotal = goodsTotal;
      this.storeData.orderTotal = orderTotal;
      this.storeData.entityTotal = entityTotal;
    }),

    setIncomeData: action(function ({
      tag, //
      syncTime,
      todayData = [],
      yesterdayData = [],
      weekData = [],
      monthData = [],
    }) {
      log.info(tag, tagStore, 'setIncomeData', {
        today: todayData,
        yesterday: yesterdayData,
        week: weekData,
        monthData,
      });
      this.incomeData.syncTime = syncTime;
      this.incomeData.today.data = todayData;
      this.incomeData.yesterday.data = yesterdayData;
      this.incomeData.week.data = weekData;
      this.incomeData.month.data = monthData;
    }),
  });
})();
