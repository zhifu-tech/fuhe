import log from '../../utils/log';

/**
 * 查询所有启用的分类
 **/
export default async function () {
  try {
    const { data } = await wx.cloud.models.fh_category.list({
      select: {
        _id: true,
        name: true,
        lx_id: true,
        category_spec: {
          _id: true,
        },
        goods_category: {
          _id: true,
        },
        gcs: {
          _id: true,
        },
        stocks: {
          _id: true,
        },
      },
      filter: {
        where: {
          disabled: {
            $eq: false,
          },
        },
      },
      getCount: true,
    });
    return data;
  } catch (e) {
    log.error('queryCategory', e);
    throw e;
  }
}
