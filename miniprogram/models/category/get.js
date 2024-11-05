export default async function ({ tag, _id }) {
  const { data } = await wx.cloud.models.fh_category.get({
    data: {
      _id: true,
      title: true,
    },
    filter: {
      where: {
        _id: { $eq: _id },
      },
    },
  });
  return {
    _id: data._id,
    title: data.title,
  };
}
