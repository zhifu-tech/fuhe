export default async function ({ tag, idList }) {
  const { data } = await wx.cloud.models.fh_cart.deleteMany({
    filter: {
      where: {
        _id: {
          $in: idList,
        },
      },
    },
  });
  return data;
}
