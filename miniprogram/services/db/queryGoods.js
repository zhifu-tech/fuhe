import log from '../../utils/log';

/*
 * 查询商品信息
 */
export default async function (ids = [], gcIds = [], gsIds = [], pageNumber = 1) {
  // 构建基础的查询参数
  const params = {
    select: {
      name: true,
      goods_category: {
        _id: true,
      },
      goods_spec: {
        _id: true,
      },
      stocks: {
        _id: true,
        kc_id: true,
        guide_price: true,
        cost_price: true,
        quantity: true,
        stock_order: {
          _id: true,
        },
        order_item: {
          _id: true,
        },
      },
    },
    getCount: true,
    pageSize: 10,
    pageNumber,
  };
  // 如果有传递 ids，则加入过滤条件
  if (ids.length > 0) {
    if (!params.filter) {
      params.filter = {};
    }
    params.filter.where = {
      _id: {
        $in: ids,
      },
    };
  }
  // 关联查询goods_category
  if (gcIds.length > 0) {
    if (!params.filter) {
      params.filter = {};
    }
    params.filter.relateWhere = {
      goods_category: {
        where: {
          _id: {
            $in: gcIds,
          },
        },
      },
    };
  }
  // 关联查询 goods_spec
  if (gsIds.length > 0) {
    if (!params.filter) {
      params.filter = {};
    }
    params.filter.relateWhere = {
      goods_spec: {
        where: {
          _id: {
            $in: gsIds,
          },
        },
      },
    };
  }
  try {
    const { data } = await wx.cloud.models.fh_goods.list(params);
    return data;
  } catch (e) {
    log.error('queryGoods', e);
    return e;
  }
}
