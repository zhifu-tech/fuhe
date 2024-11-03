export default async function ({ _id }) {
  await wx.cloud.models.fh_category.delete({
    filter: {
      where: {
        $and: [
          {
            _id: { $eq: _id },
          },
        ],
      },
    },
  });
}
