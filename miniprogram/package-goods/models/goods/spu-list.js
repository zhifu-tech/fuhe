import log from '@/common/log/log';
import stores from '@/stores/index';
import services from '@/services/index';

export default async function ({ tag, cId, pageNumber, pageSize }) {
  const params = _createParams({ pageNumber, pageSize });
  if (cId && cId !== stores.category.categoryAll._id) {
    params['filter'] = {
      where: {
        cId: { $eq: cId },
      },
    };
  }
  try {
    const { data } = await wx.cloud.models.fh_goods_spu.list(params);
    log.info(tag, 'goods-spu-list', data);
    return data;
  } catch (error) {
    log.error(tag, 'goods-spu-list', error);
    throw error;
  }
}

export async function spuListByIdList({ tag, idList, pageNumber = 1, pageSize = 200 }) {
  const params = _createParams({ pageNumber, pageSize });
  params['filter'] = {
    where: {
      _id: { $in: idList },
    },
  };
  try {
    const { data } = await wx.cloud.models.fh_goods_spu.list(params);
    data.records.forEach((spu) => {
      spu.skuList = spu.skuList || [];
      spu.category = spu.category || {};
    });
    log.info(tag, 'goods-spu-list-by-id-list', data);
    return data;
  } catch (error) {
    log.error(tag, 'goods-spu-list-by-id-list', error);
    throw error;
  }
}

function _createParams({ pageNumber, pageSize }) {
  return {
    select: {
      _id: true,
      cId: true,
      title: true,
      desc: true,
      category: {
        _id: true,
        title: true,
      },
      skuList: {
        _id: true,
        imageList: true,
        optionIdList: true,
      },
      supplierId: true,
      supplierName: true,
      supplier: {
        _id: true,
        name: true,
      },
      createdAt: true, // 2024-10-12 08:17:42
      updatedAt: true, // 2024-10-12 08:17:42
    },
    orderBy: [
      { createdAt: 'desc' }, // 创建时间升序排列
    ],
    getCount: true,
    pageNumber,
    pageSize,
  };
}
