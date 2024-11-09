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
};
