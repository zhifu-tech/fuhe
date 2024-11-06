import specService from './index';

export default async function (tag, spuList) {
  log.info(tag, 'fetchSpecList');
  if (!spuList || spuList.length <= 0) return;
  // 创建一个 Set 来保存所有的 cId，并去重
  const cIdSet = new Set();
  spuList.forEach(({ cId }) => {
    if (cId) cIdSet.add(cId);
  });
  const cIdList = Array.from(cIdSet);
  const cIdSpecListMap = await specService.getSpecListBatch({
    tag,
    cIdList,
  });
  spuList.forEach((spu) => {
    spu.specList = cIdSpecListMap.get(spu.cId) || [];
  });
}
