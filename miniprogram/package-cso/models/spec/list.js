import log from '@/common/log/log';

export default async function ({ tag, cId }) {
  try {
    const { data } = await wx.cloud.models.fh_spec.list({
      select: {
        _id: true,
        cId: true,
        title: true,
        optionList: {
          _id: true,
          sId: true,
          title: true,
        },
      },
      filter: {
        where: {
          cId: { $eq: cId },
        },
      },
      getCount: true,
      pageNumber: 1,
      pageSize: 200,
    });
    log.info(tag, 'spec-list', data);
    return data;
  } catch (error) {
    log.error(tag, 'spec-list', error);
    throw error;
  }
}
