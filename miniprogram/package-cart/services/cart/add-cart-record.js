import log from '@/common/log/log';
import cartModels from '../../models/cart/index';
import cartServices from './index';
import cartStore from '../../stores/cart/index';
import { runInAction } from 'mobx-miniprogram';

export default async function addCartRecord({
  tag,
  spuId,
  skuId,
  stockId,
  salePrice,
  saleQuantity,
}) {
  try {
    const id = await cartModels.create({
      tag,
      spuId,
      skuId,
      stockId,
      salePrice,
      saleQuantity,
    });

    // 拉取新增记录，并更新store
    log.info(tag, 'addCartRecord', 'create', id);
    cartServices.getCartRecord({ tag, _id: id, useStore: false });
    return id;
  } catch (error) {
    log.error(tag, 'addCartRecord', error);
    throw error;
  }
}

export async function addCartRecordList({ tag, infoList }) {
  try {
    const idList = await cartModels.createMany({
      tag,
      infoList,
    });

    // 加入到购物车中
    log.info(tag, 'addCartRecords', 'createList', idList);
    runInAction(() => {
      infoList.forEach((info, index) => {
        info._id = idList[index];
        cartStore.addCartRecord({ tag, record: info });
      });
    });
    return idList;
  } catch (error) {
    log.error(tag, 'addCartRecords', error);
    throw error;
  }
}
