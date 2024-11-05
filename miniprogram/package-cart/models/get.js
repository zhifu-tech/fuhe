export default async function ({ _id }) {
  const { data } = await wx.cloud.models.fh_cart.get({
    data: {
      _id: true,
      saasId: true,
      spuId: true,
      skuId: true,
      stockId: true,
      salePrice: true,
      saleQuantity: true,
      createAt: true,
      updateAt: true,
    },
    filter: {
      where: {
        $and: [
          {
            _id: {
              $eq: _id,
            },
          },
        ],
      },
    },
  });
  return {
    _id: data._id,
    saasId: data.saasId,
    spuId: data.spuId,
    skuId: data.skuId,
    stockId: data.stockId,
    salePrice: data.salePrice,
    saleQuantity: data.saleQuantity,
    createAt: data.createAt,
    updateAt: data.updateAt,
  };
}
