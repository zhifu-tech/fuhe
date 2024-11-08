import log from '@/common/log/log';
import categoryStore from '../../stores/category/index';

export default function ({ tag, cId }) {
  log.info(tag, 'switch-selected-category', cId);
  categoryStore.selected = cId;
}
