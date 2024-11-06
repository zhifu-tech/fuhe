import log from '@/common/log/log';
import categoryStore from '../../stores/category/index';

export default function ({ tag, cId }) {
  log.info('switch-selected-category', tag, cId);
  categoryStore.switchSelectedCategory({
    tag,
    cId,
  });
}
