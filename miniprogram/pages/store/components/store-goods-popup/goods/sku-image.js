module.exports = Behavior({
  methods: {
    handleAddImage: function (e) {
      const { sku } = this.data;
      const { files } = e.detail;
      console.log('101010100', files);
      const imageList = sku.imageList || [];
      this.setData({
        // 浅拷贝创建新的imageList
        'sku.imageList': [...imageList, ...files],
      });
    },
    handleRemoveImage: function (e) {
      const { index } = e.detail;
      const { sku } = this.data;
      const imageList = sku.imageList || [];
      this.setData({
        // 浅拷贝创建新的imageList
        'sku.imageList': imageList.toSpliced(index, 1),
      });
    },
  },
});
