export default async function list({ saasId, pageNumber }) {
  const { data } = await wx.cloud.models.fh_cart.list({
    select: {
      _id: true,
      spuId: true,
      skuId: true,
      stockId: true,
      salePrice: true,
      saleQuantity: true,
    },
    filter: {
      where: {
        $and: [
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
