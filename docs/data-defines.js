/** saas = Software as a Service, 软体服务
 * 每一个入驻商户具有一个唯一的 saas id
 */
const saas_define = {
  id: '唯一标识',
  title: '名称',
};
/** 商品类别信息
 * 商品所属的分类信息，如电子产品、服装、食品等。通过分类，能够更好地组织和管理商品 */
const category_define = {
  id: '唯一标识',
  title: '分类名称',
  saasId: '软体服务标识',
};
/** 商品规格信息 */
const spec_define = {
  id: '唯一标识',
  title: '规格名称',
  cId: '所属类别的标识',
};
/** 商品规格对应的选项信息 */
const option_define = {
  id: '唯一标识',
  title: '选项名称',
  sId: '所属规格的标识',
};
/** 实体信息，个人和公司 */
const entity_define = {
  id: '唯一标识',
  title: '名称',
  signature: '签名',
  tel: '联系方式',
  contacts: '联系人，对应的entity id',
};
/** 商品的SPU信息 */
const spu_define = {
  id: '唯一标识',
  cId: '商品类别标识',
  title: '商品名称 <text>',
  desc: '产品描述 <text>',
  supplierId: '供货商的标识',
};
/** 商品的SKU信息 */
const sku_define = {
  id: '唯一标识',
  spuId: 'sku所属spu的标识',
  optionIdList: '对应的规格的具体的信息,选项的标识',
  imageList: '图片，图片信息, 大图+缩略图',
  // restockThreshold: '补货阈值，当库存低于此值时需要补货',
  stockList: '存储信息，每次入库生成一条记录',
  createdAt: 'string', // 创建时间
  updatedAt: 'string', // 更新时间
};
/** 商品的库存Stock信息 */
const stock_define = {
  id: '唯一标识',
  skuId: 'sku的唯一标识',
  location: '库存存放位置',
  quantity: '数量，xx 件/斤/想等',
  availableQuantity: '可用库存数量',
  onOrderQuantity: '在途库存数量，已下单但未到货',
  costPrice: '成本价格',
  createdAt: '入库的时间',
  updatedAt: '更新时间',
};
/** 商品信息，查询其他信息得到 */
const goods_define = {
  id: '唯一标识',
  spuId: 'spu的ID', // 依次查询spu的完整信息
  skuList: 'sku完整信息', // 通过spuId关联 SPU和SKU信息得到
  stockList: '库存信息，查询所有的sku的skuId得到',
  specList: '规格信息列表', // 通过sku的optionList查询得到',
};
