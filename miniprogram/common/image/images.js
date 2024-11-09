export async function uploadSkuImageList(sku) {
  // 过滤出所有可以上传的图片
  const imageSet = new Set();
  _filterImageList(sku, imageSet);
  // 无可上传图片，直接退出
  if (imageSet.size === 0) {
    return;
  }
  const imageList = Array.from(imageSet);
  const imageUrls = await _uploadImageList({
    id: sku._id,
    imageList,
  });
  _replaceSkuImageFile(sku, imageList, imageUrls);
}

/** 过滤出所有可以上传的图片 */
export async function uploadSpuImageList(skuList) {
  const imageSet = new Set();
  skuList.forEach((sku) => {
    _filterImageList(sku, imageSet);
  });
  // 无可上传图片，直接退出
  if (imageSet.size === 0) {
    return;
  }
  const imageList = Array.from(imageSet);
  const imageUrls = await _uploadImageList({
    id: skuList[0]._id,
    imageList,
  });
  skuList.forEach((sku) => {
    _replaceSkuImageFile(sku, imageList, imageUrls);
  });
}

function _filterImageList(sku, imageSet) {
  sku.imageList?.forEach((image) => {
    if (_isUploadImage(image)) {
      imageSet.add(image.url);
    }
  });
}
function _isUploadImage(image) {
  return typeof image === 'object' && image.url && image.url.startsWith('http://tmp');
}

async function _uploadImageList({ id, imageList }) {
  // 创建所有上传操作的 Promise 数组
  const promises = imageList.map((image) =>
    _uploadFile({
      id,
      filePath: image,
    }),
  );
  try {
    // 等待所有上传任务完成
    const uploadResults = await Promise.all(promises);
    // 提取每个上传结果中的 fileID
    const fileIDs = uploadResults.map((result) => result.fileID);
    // 获取临时文件的 URL
    const tempFileUrls = await wx.cloud.getTempFileURL({
      fileList: fileIDs,
    });
    const imageUrls = tempFileUrls.fileList.map((file) => file.tempFileURL);
    return imageUrls;
  } catch (err) {
    console.log('image-upload', '_uploadImageList', error);
    throw error;
  }
}
// 使用 Promise 封装 wx.cloud.uploadFile
function _uploadFile({ id, filePath }) {
  const cloudPath = `upload/goods/${id}${filePath.match(/\.[^.]+?$/)[0]}`;

  return new Promise((resolve, reject) => {
    wx.cloud.uploadFile({
      cloudPath, // 上传到云存储的路径
      filePath, // 本地文件路径
      success: (res) => {
        console.log('image-upload', filePath, 'upload success!', res);
        resolve(res); // 上传成功，返回结果
      },
      fail: (err) => {
        console.log('image-upload', '_uploadFile', filePath, 'upload failed!', err);
        reject(err); // 上传失败，抛出错误
      },
    });
  });
}
/** 替换所有本地地址为服务端地址 */
function _replaceSkuImageFile(sku, imageList, imageUrls) {
  sku.imageList?.forEach((image, i) => {
    if (!_isUploadImage(image)) return;
    const url = image.url;
    const k = imageList.findIndex((it) => it === url);
    if (k !== -1) {
      sku.imageList[i] = imageUrls[k];
    }
  });
}

// 使用 Promise 封装 wx.cloud.uploadFile
export async function deleteImageFiles(fileList) {
  await wx.cloud.deleteFile({
    fileList,
  });
}
