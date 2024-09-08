import log from '../../utils/log';

/**
 * 查询所有的规格信息
 **/
export default async function (csIds = [], pageNumber = 1, getCount = false) {
  const params = {
    select: {
      name: true,
      category_spec: {
        _id: true,
      },
      goods_spec: {
        _id: true,
      },
    },
    getCount: false,
    pageSize: 9999,
    getCount: true,
    pageSize: 10,
    pageNumber,
  };
  log.info('querySpec', csIds);
  if (csIds.length > 0) {
    if (!params.filter) params.filter = {};
    params.filter.relateWhere = {
      category_spec: {
        where: {
          _id: {
            $in: csIds,
          },
        },
      },
    };
  }
  try {
    log.info('querySpec', params);
    const { data } = await wx.cloud.models.fh_spec.list(params);
    return data;
  } catch (e) {
    log.error('querySpec', e);
    throw e;
  }
}
