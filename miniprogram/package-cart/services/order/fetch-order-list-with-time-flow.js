import dayjs from 'dayjs';
import log from '@/common/log/log';
import orderModel from '../../models/order/index';

/** 拉取创建时间在[startTimeMs, endTimeMs]之间的所有订单数据 */
export default async function fetchOrderListWithTimeInterval({
  tag, //
  startTimeMs,
  endTimeMs,
}) {
  log.info(
    tag,
    'fetchOrderListWithTimeFlow',
    dayjs(startTimeMs).format('YYYY-MM-DD HH:mm'),
    dayjs(endTimeMs).format('YYYY-MM-DD HH:mm'),
  );
  let pageNumber = 0;
  let results = [];
  let totals = 0;
  try {
    do {
      ++pageNumber;
      const { records, total } = await orderModel.list({
        tag,
        pageNumber,
        pageSize: 100,
        startTimeMs,
        endTimeMs,
      });
      totals = total;
      results = results.concat(records);
    } while (results.length < totals);
    log.info(
      tag,
      'fetchOrderListWithTimeFlow',
      'startTime:' + dayjs(startTimeMs).format('YYYY-MM-DD HH:mm'),
      'endTime:' + dayjs(endTimeMs).format('YYYY-MM-DD HH:mm'),
      results,
      totals,
    );
    return { records: results, total: totals };
  } catch (error) {
    log.error(tag, 'fetchOrderListWithTimeFlow', error);
    throw error;
  }
}
