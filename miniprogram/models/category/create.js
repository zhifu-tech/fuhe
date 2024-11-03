export default async function ({ saasId, title }) {
  const { data } = await wx.cloud.models.fh_category.create({
    data: {
      saasId,
      title,
      disabled: 0,
    },
  });
  return data.id;
}
