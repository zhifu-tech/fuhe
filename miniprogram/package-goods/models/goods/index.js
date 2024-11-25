import log from '@/common/log/log';
import { saasId } from '@/common/saas/saas';

export default {
  _createSpuParams: ({
    // 分类信息
    cId,
    // 供应商信息
    supplierId,
    supplierName,
    // 商品信息
    title,
    desc,
  }) => ({
    saasId: saasId(),
    // 分类信息
    cId,
    category: {
      _id: cId,
    },
    // 供应商信息
    supplierId,
    supplierName,
    supplier: {
      _id: supplierId,
    },
    // 商品信息
    title,
    desc,
  }),
  _selectSpuParams: function ({ withCategory, withSupplier, withSkuList }) {
    return {
      _id: true,
      // 商户信息
      saasId: true,
      // 商品编码
      code: true,
      // 商品信息
      title: true,
      desc: true,
      // 分类信息
      cId: true,
      ...(withCategory && {
        category: {
          _id: true,
          name: true,
        },
      }),
      // 供应商信息
      supplierId: true,
      supplierName: true,
      ...(withSupplier && {
        supplier: {
          _id: true,
          name: true,
        },
      }),
      // 商品规格信息
      ...(withSkuList && {
        skuList: this._selectSkuParams(),
      }),
    };
  },
  _createSkuParams: ({ spuId, salePrice, imageList, optionIdList }) => ({
    // 商品信息
    spuId,
    spu: {
      _id: spuId,
    },
    // 图片信息
    imageList,
    // 规格信息
    optionIdList,
    // 商品信息
    salePrice,
  }),
  _selectSkuParams: function (withSpu) {
    return {
      _id: true,
      spuId: true,
      // 商品信息
      ...(withSpu && {
        spu: this._createSpuParams(),
      }),
      // 图片信息
      imageList: true,
      // 规格信息
      optionIdList: true,
    };
  },
  createSpu: async function ({ tag, param }) {
    try {
      const { data } = await wx.cloud.models.fh_goods_spu.create({
        data: this._createSpuParams(param),
      });
      log.info(tag, 'goods-spu-create', title, data);
      return data.id;
    } catch (error) {
      log.error(tag, 'goods-spu-create', error);
      throw error;
    }
  },
  createSku: async function ({ tag, param }) {
    try {
      const { data } = await wx.cloud.models.fh_goods_sku.create({
        data: this._createSkuParams(param),
      });
      log.info(tag, 'goods-sku-create', data);
      return data;
    } catch (error) {
      log.error(tag, 'goods-sku-create', error);
      throw error;
    }
  },
  createSkuMany: async function ({ tag, paramList }) {
    try {
      const { data } = await wx.cloud.fh_goods_sku.createMany({
        data: paramList.map(this._createSkuParams),
      });
      log.info(tag, 'goods-sku-createMany', data);
      return data;
    } catch (error) {
      log.error(tag, 'goods-sku-createMany', error);
      throw error;
    }
  },
  getSpu: async function ({ tag, _id }) {
    try {
      const { data } = await wx.cloud.models.fh_goods_spu.get({
        select: this._selectSpuParams(),
        filter: {
          where: {
            $and: [{ _id: { $eq: _id } }],
          },
        },
      });
      log.info(tag, 'goods-spu-get', data);
      return data;
    } catch (error) {
      log.error(tag, 'goods-spu-get', error);
      throw error;
    }
  },
  listSpu: async function ({
    tag, //
    cId,
    idList,
    pageNumber = 1,
    pageSize = 10,
    sortbyUpdated = true,
  }) {
    try {
      const { data } = await wx.cloud.models.fh_goods_spu.list({
        select: this._selectSpuParams({
          withSkuList: true,
        }),
        filter: {
          where: {
            $and: [
              { saasId: { $eq: saasId() } }, //
              ...((cId && cId !== '1' && [{ cId: { $eq: cId } }]) || []),
              ...((idList && [{ _id: { $in: idList } }]) || []),
            ],
          },
        },
        orderBy: [
          ...((sortbyUpdated && [{ updatedAt: 'desc' }]) || []),
          ...((!sortbyUpdated && [{ createdAt: 'desc' }]) || []),
        ],
        getCount: true,
        pageNumber,
        pageSize,
      });
      log.info(tag, 'goods-spu-list', data);
      return data;
    } catch (error) {
      log.error(tag, 'goods-spu-list', error);
      throw error;
    }
  },
  allSpu: async function ({
    tag, //
    cId,
    idList,
    sortbyUpdated,
  }) {
    try {
      let pageNumber = 0;
      let results = [];
      let totals = 0;
      do {
        ++pageNumber;
        const { rescords, total } = await this.listSpu({
          tag,
          cId,
          idList,
          pageNumber,
          pageSize: 200,
          sortbyUpdated,
        });
        totals = total;
        results = results.concat(rescords);
      } while (results.length < totals);

      log.info(tag, 'goods-spu-all', results);
      return { records: results, total: totals };
    } catch (error) {
      log.error(tag, 'goods-spu-all', error);
      throw error;
    }
  },
  updateSpu: async function ({ tag, _id, param }) {
    try {
      const { data } = await wx.cloud.models.fh_goods_spu.update({
        data: {
          ...(param.title != null && { title: param.title }),
          ...(param.desc != null && { desc: param.desc }),
          ...(param.supplierId != null && { supplierId: param.supplierId }),
          ...(param.supplierName != null && { supplierName: param.supplierName }),
        },
        filter: {
          where: {
            $and: [{ _id: { $eq: _id } }],
          },
        },
      });
      log.info(tag, 'goods-spu-update', pData, data);
      return data;
    } catch (error) {
      log.error(tag, 'goods-spu-update', error);
      throw error;
    }
  },
  updateSku: async function ({ tag, _id, param }) {
    try {
      const { data } = await wx.cloud.models.fh_goods_sku.update({
        data: {
          ...(param.imageList && { imageList: param.imageList }),
        },
        filter: {
          where: {
            $and: [{ _id: { $eq: _id } }],
          },
        },
      });
      log.info(tag, 'goods-sku-update', data);
      return data;
    } catch (error) {
      log.error(tag, 'goods-sku-update', error);
      throw error;
    }
  },
  deleteSku: async function ({ tag, _id }) {
    try {
      const { data } = await wx.cloud.models.fh_goods_sku.delete({
        filter: {
          where: {
            $and: [{ _id: { $eq: _id } }],
          },
        },
      });
      log.info(tag, 'goods-sku-delete', data);
      return data;
    } catch (error) {
      log.error(tag, 'goods-sku-delete', error);
      throw error;
    }
  },
};
