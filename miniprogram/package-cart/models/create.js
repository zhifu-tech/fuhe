export default async function ({
  saasId, //
  spuId,
  skuId,
  stockId,
  salePrice,
  saleQuantity,
}) {
  const { data } = await wx.cloud.models.fh_cart.create({
    data: {
      saasId,
      spuId,
      skuId,
      stockId,
      salePrice,
      saleQuantity,
    },
  });
  return data.id;
}
