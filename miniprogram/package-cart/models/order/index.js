import log from '@/common/log/log';
import { saasId } from '@/common/saas/saas';

export default {
  create: async function ({
    tag,
    userId,
    userName,
    customerId,
    customerName,
    providerId,
    providerName,
  }) {
    try {
      const { data } = await wx.cloud.models.fh_order.create({
        data: {
          saasId: saasId(),
          type: 1, // 类型，0 入库，1出库
          status: 1, // 状态：1 已下单, 200 已完成
          // 下单用户
          userId,
          userName,
          user: {
            _id: userId, // 关联用户ID
          },
          // 需求方
          customerId,
          customerName,
          customer: {
            _id: customerId, // 关联用户ID
          },
          // 供应方
          providerId,
          providerName,
          provider: {
            _id: providerId, // 关联用户ID
          },
        },
      });
      log.info(tag, 'order-create', data);
      return data.id;
    } catch (error) {
      log.error(tag, 'order-create', error);
      throw error;
    }
  },
  createItem: async function ({ tag, info }) {
    try {
      const { data } = await wx.cloud.models.fh_order_item.create({
        data: _createItemData(info),
      });
      log.info(tag, 'order-item-create', data);
      return data.id;
    } catch (error) {
      log.error(tag, 'order-item-create', error);
      throw error;
    }
  },
  createItemList: async function ({ tag, infoList }) {
    try {
      const { data } = await wx.cloud.models.fh_order_item.createMany({
        data: infoList.map((info) => _createItemData(info)),
      });
      log.info(tag, 'order-item-create', data);
      return data.idList;
    } catch (error) {
      log.error(tag, 'order-item-create', error);
      throw error;
    }
  },
  get: async function ({ tag, _id }) {
    try {
      const { data } = await wx.cloud.models.fh_order.get({
        select: _selectData(),
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
      log.info(tag, 'order-get', data);
      return data;
    } catch (error) {
      log.error(tag, 'order-get', error);
      throw error;
    }
  },
  list: async function ({ tag, pageNumber }) {
    try {
      const { data } = await wx.cloud.models.fh_order.list({
        select: _selectData(),
        filter: {
          where: {
            $and: [
              {
                saasId: { $eq: saasId() },
              },
            ],
          },
        },
        sortby: [
          {
            createdAt: 'desc',
          },
        ],
        pageSize: 10,
        pageNumber,
        getCount: true,
      });
      log.info(tag, 'order-list', data, _selectData());
      return data;
    } catch (error) {
      log.error(tag, 'order-list', error);
      throw error;
    }
  },
};

const _createItemData = ({
  orderId,
  spuId,
  spuTitle,
  skuId,
  skuTitle,
  stockId,
  supplierId,
  supplierName,
  salePrice,
  saleQuantity,
  originalPrice,
}) => ({
  // 订单信息
  orderId, // 关联订单ID
  order: {
    _id: orderId, // 关联订单ID
  },
  // 商品信息
  spuId,
  spuTitle,
  spu: {
    _id: spuId, // 关联商品ID
  },
  // 商品规格信息
  skuId,
  skuTitle,
  sku: {
    _id: skuId, // 关联商品SKU ID
  },
  // 库存信息
  stockId,
  stock: {
    _id: stockId, // 关联库存ID
  },
  // 供应商信息
  supplierId,
  supplierName,
  supplier: {
    _id: supplierId, // 关联供应商ID
  },
  // 价格、数量信息
  salePrice,
  saleQuantity,
  originalPrice,
});

const _selectData = () => ({
  _id: true,
  saasId: true,
  type: true,
  status: true,
  // 下单用户
  userId: true,
  userName: true,
  // 收货人信息
  customerId: true,
  customerName: true,
  // 供应方
  providerId: true,
  providerName: true,
  // 订单信息
  createdAt: true,
  // 订单条目信息
  itemList: {
    _id: true,
    // 订单信息
    orderId: true, // 关联订单ID
    // 商品信息
    spuId: true,
    spuTitle: true,
    // 商品规格信息
    skuId: true,
    skuTitle: true,
    // 库存信息
    stockId: true,
    // 供应商信息
    supplierId: true,
    supplierName: true,
    // 价格、数量信息
    salePrice: true,
    saleQuantity: true,
    originalPrice: true,
  },
});
