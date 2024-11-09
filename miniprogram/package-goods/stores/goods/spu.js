import log from '@/common/log/log';
import { action } from 'mobx-miniprogram';

export default {
  updateSpuInfo: action(function ({ tag, spu, title, desc }) {
    if (title != null) {
      spu.title = title;
    }
    if (desc != null) {
      spu.desc = desc;
    }
  }),
  addSku: action(function ({ tag, spu, sku }) {
    spu.skuList = spu.skuList || [];
    if (!sku._id) {
      sku._id = `-${spu.skuList.length + 1}`;
    }
    sku.spuId = spu._id;
    spu.skuList.push(sku);
  }),
};
