import log from '../common/log/log';
import category from './category/index';
import goods from './goods/index';

/**
 * 该模块为数据模型的操作集合。
 * 1. 尊循极简的原则，只提供数据模型操作，
 * 2. 不做异常处理、日记输出等不必要的操作
 */
export default {
  category,
  goods,
};
