import log from '@/common/log/log';
import services from '@/services/index';
import dashboardStore from '../../stores/dashboard/index';
import dashboardModel from '../../models/dashboard/index';
import { flow } from 'mobx-miniprogram';
import dayjs from 'dayjs';

export default function syncIncomeData({ tag, trigger, callback }) {
  let _task = _syncIncomeData({
    tag,
    trigger,
    callback,
    _finally: () => {
      _task = null;
    },
  });
  return {
    key: 'syncIncomeData',
    dispose: () => {
      _task?.cancel();
      _task = null;
    },
  };
}

const _syncIncomeData = flow(function* ({
  tag, //
  trigger,
  callback,
  _finally,
}) {
  callback({ code: 'loading', trigger });
  log.info(tag, 'syncIncomeData', trigger);
  const todayStartTimeMs = new Date().setHours(0, 0, 0, 0);
  const oneDayDuration = 24 * 60 * 60 * 1000;

  try {
    // 将today和 yesterday 改成并行处理
    const [todayData, yesterdayData, weekData, monthData] = yield Promise.all([
      // 获取今天的数据，今天的数据，实时计算得到
      getOnedayDataFromOrder({
        tag,
        startTimeMs: todayStartTimeMs,
        endTimeMs: todayStartTimeMs + oneDayDuration,
      }),
      // 获取昨天的数据，昨天数据首先从income的表中获取，如果获取到则使用；否则重新拉取
      getOnedayData({
        tag,
        startTimeMs: todayStartTimeMs - oneDayDuration,
        endTimeMs: todayStartTimeMs,
      }),
      getOneWeekData({ tag }),
      getOneMonthData({ tag }),
    ]);

    setTodayData(todayData, monthData);

    dashboardStore.setIncomeData({
      tag,
      todayData,
      yesterdayData,
      weekData,
      monthData,
    });
    callback({ code: 'success', trigger });
    log.info(tag, 'syncIncomeData', 'end');
  } catch (error) {
    log.error(tag, 'syncIncomeData', error);
    throw error;
  } finally {
    _finally?.();
  }
});

function setTodayData(todayData, ...dayData) {
  const todaySummary = todayData.reduce(
    (acc, cur) => {
      acc.cost += cur.cost;
      acc.income += cur.income;
      acc.profit += cur.profit;
      return acc;
    },
    {
      syncTime: new Date().getTime(),
      cost: 0,
      income: 0,
      profit: 0,
    },
  );
  dayData.forEach((day) => day.push(todaySummary));
}

async function getOnedayData({ tag, startTimeMs, endTimeMs }) {
  log.info(
    tag,
    'getOnedayData',
    dayjs(startTimeMs).format('YYYY-MM-DD HH:mm:ss'),
    dayjs(endTimeMs).format('YYYY-MM-DD HH:mm:ss'),
  );
  const { records, total } = await dashboardModel.getIncomeHourData({
    tag,
    startTimeMs,
    endTimeMs,
  });
  if (records.length !== 0) {
    log.info(tag, 'getOnedayData', 'hit income_hour', records.length);
    return records.reverse();
  }
  const infoList = await getOnedayDataFromOrder({
    tag,
    startTimeMs,
    endTimeMs,
  });
  await dashboardModel.setIncomeHourData({ tag, records: infoList });
  log.info(tag, 'getOnedayData', 'miss income_hour', infoList.length);
  return infoList;
}

async function getOnedayDataFromOrder({ tag, startTimeMs, endTimeMs }) {
  log.info(
    tag,
    'getOnedayDataFromOrder',
    dayjs(startTimeMs).format('YYYY-MM-DD HH:mm:ss'),
    dayjs(endTimeMs).format('YYYY-MM-DD HH:mm:ss'),
  );
  const dayData = [];
  const { records } = await services.order.fetchOrderListWithTimeInterval({
    tag,
    startTimeMs,
    endTimeMs,
  });
  // 如果查询到订单数，补全到当前时间
  // '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'
  let rIndex = records.length - 1;
  const nowTimeMs = new Date().getTime();
  [20, 16, 12, 8, 4, 0].forEach((offset) => {
    const guardTimeMs = new Date(startTimeMs).setHours(offset, 0, 0, 0);
    // 如果当前时间大于当前时间，则不处理
    if (guardTimeMs > nowTimeMs) return;
    const item = {
      cost: 0,
      income: 0,
      profit: 0,
      syncTime: guardTimeMs,
    };
    dayData.unshift(item);
    while (rIndex >= 0 && records[rIndex].syncTime >= guardTimeMs) {
      records[rIndex]?.itemList?.forEach((r) => {
        const cost = r.costPrice * r.saleQuantity || 0;
        const income = r.salePrice * r.saleQuantity || 0;
        item.cost += cost;
        item.income += income;
        item.profit += income - cost;
      });
      rIndex--;
    }
  });
  log.info(tag, 'syncIncomeData', dayData);
  return dayData;
}

async function getOnedayDayData({ tag, startTimeMs, endTimeMs }) {
  const dayData = await getOnedayData({ tag, startTimeMs, endTimeMs });
  const data = dayData.reduce(
    (acc, cur) => {
      acc.cost += cur.cost;
      acc.income += cur.income;
      acc.profit += cur.profit;
      return acc;
    },
    {
      syncTime: endTimeMs - 1,
      cost: 0,
      income: 0,
      profit: 0,
    },
  );
  return data;
}

async function getOneWeekData({ tag }) {
  const today = new Date();
  const todayStartTimeMs = new Date().setHours(0, 0, 0, 0);
  // 默认一周从周日开始算，这里改成从周一开始算
  const weekDay = (today.getDay() - 1 + 7) % 7;
  const oneDayMs = 24 * 60 * 60 * 1000;
  const weekDayStartTimeMs = todayStartTimeMs - weekDay * oneDayMs;
  const weekDayEndTimeMs = weekDayStartTimeMs + 7 * oneDayMs;

  const { records } = await dashboardModel.getIncomeDayData({
    tag,
    startTimeMs: weekDayStartTimeMs,
    endTimeMs: weekDayEndTimeMs,
  });
  // ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  const weekData = records;
  const pendings = [];
  log.info(tag, 'todayStartTimeMs', dayjs(todayStartTimeMs).format('YYYY-MM-DD HH:mm:ss'));
  log.info(tag, 'weekDayStartTimeMs', dayjs(weekDayStartTimeMs).format('YYYY-MM-DD HH:mm:ss'));
  log.info(tag, 'weekDayEndTimeMs', dayjs(weekDayEndTimeMs).format('YYYY-MM-DD HH:mm:ss'));
  for (var time = todayStartTimeMs; time >= weekDayStartTimeMs; time -= oneDayMs) {
    // 是否存在 time的记录
    const hasRecord = records.some((r) => {
      return r.syncTime >= time && r.syncTime < time + oneDayMs;
    });
    if (!hasRecord) {
      pendings.unshift(time);
    }
  }
  if (pendings.length > 0) {
    log.info(
      tag,
      'getOneWeekData',
      '需要补数的日期',
      pendings.map((t) => dayjs(t).format('YYYY-MM-DD HH:mm:ss')),
    );
    const resultsList = await Promise.all(
      pendings.map((startTimeMs) =>
        getOnedayDayData({
          tag,
          startTimeMs: startTimeMs,
          endTimeMs: startTimeMs + oneDayMs,
        }),
      ),
    );
    // 更新数据
    await dashboardModel.setIncomeDayData({
      tag,
      records: resultsList,
    });
    // 更新结果数组
    weekData.push(...resultsList);
    weekData.sort((a, b) => a.syncTime - b.syncTime);
  }
  log.info(tag, 'getOneWeekData', '最后到结果', weekData);
  return weekData;
}

async function getOneMonthData({ tag }) {
  const today = new Date();
  const todayStartTimeMs = new Date().setHours(0, 0, 0, 0);
  const oneDayMs = 24 * 60 * 60 * 1000;
  const monthDay = today.getDate();
  const monthDayStartTimeMs = todayStartTimeMs - (monthDay - 1) * oneDayMs;
  const monthDayEndTimeMs = monthDayStartTimeMs + monthDay * oneDayMs;

  const { records } = await dashboardModel.getIncomeDayData({
    tag,
    startTimeMs: monthDayStartTimeMs,
    endTimeMs: monthDayEndTimeMs,
  });

  log.info(tag, 'todayStartTimeMs', dayjs(todayStartTimeMs).format('YYYY-MM-DD HH:mm:ss'));
  log.info(tag, 'monthDayStartTimeMs', dayjs(monthDayStartTimeMs).format('YYYY-MM-DD HH:mm:ss'));
  log.info(tag, 'monthDayEndTimeMs', dayjs(monthDayEndTimeMs).format('YYYY-MM-DD HH:mm:ss'));

  const monthData = [];
  let rIndex = records.length - 1;
  const nowTimeMs = new Date().getTime();
  // ['1号', '5号', '10号', '15号', '20号', '25号', '31号']
  [25, 20, 15, 10, 5, 0].forEach((offset) => {
    const guardTimeMs = new Date(monthDayStartTimeMs).setDate(offset);
    // 如果当前时间大于当前时间，则不处理
    if (guardTimeMs > nowTimeMs) return;
    const item = {
      cost: 0,
      income: 0,
      profit: 0,
      syncTime: guardTimeMs,
    };
    monthData.unshift(item);
    while (rIndex >= 0 && records[rIndex].syncTime > guardTimeMs) {
      const r = records[rIndex];
      item.cost += r.cost;
      item.income += r.income;
      item.profit += r.income - r.cost;
      rIndex--;
    }
  });
  log.info(tag, 'getOneMonthData', '最后到结果', monthData);
  return monthData;
}
