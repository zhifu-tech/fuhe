export default async function list({ saasId, pageNumber }) {
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

export async function all({ saasId }) {
  let pageNumber = 0;
  let results = [];
  let totals = 0;
  do {
    ++pageNumber;
    const { records, total } = await list({ saasId, pageNumber });
    totals = total;
    results = [...results, ...records];
  } while (results.length < totals);

  return { records: results, total: results.length };
}
