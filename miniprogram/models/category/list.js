export default async function list({ tag, saasId, pageNumber }) {
  const { data } = await wx.cloud.models.fh_category.list({
    select: {
      _id: true,
      saasId: true,
      title: true,
    },
    filter: {
      where: {
        $and: [
          {
            disabled: { $eq: 0 },
          },
          {
            saasId: { $eq: saasId },
          },
        ],
      },
    },
    getCount: true,
    pageNumber,
    pageSize: 200,
  });
  return data;
}
