export default async function ({ _id, title }) {
  await wx.cloud.models.fh_category.update({
    data: {
      title,
    },
    filter: {
      where: {
        _id: { $eq: _id },
      },
    },
  });
}
