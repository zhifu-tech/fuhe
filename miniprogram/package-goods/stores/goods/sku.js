import log from '@/common/log/log';
import { action } from 'mobx-miniprogram';

export default {
  updateSkuImageList: action(function ({ sku, imageList }) {
    sku.imageList = imageList;
  }),
};
