export default async function ({ _id, salePrice, saleQuantity }) {
  const data = await wx.cloud.models.fh_cart.update({
    data: {
      salePrice,
      saleQuantity,
    },
    filter: {
      where: {
        _id: { $eq: _id },
      },
    },
  });
  return data;
}

export async function updateMany({ idList, salePrice, saleQuantity }) {
  const data = await wx.cloud.models.fh_cart.updateMany({
    data: {
      salePrice,
      saleQuantity,
    },
    filter: {
      where: {
        _id: { $in: idList },
      },
    },
  });
  return data;
}
