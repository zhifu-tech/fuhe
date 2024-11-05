
import { DataModelMethods } from "@cloudbase/wx-cloud-client-sdk";
interface IModalFhCart {
  /**
   * saleQuantity
   *
   */
  saleQuantity: number;
  /**
   * salePrice
   *
   */
  salePrice: number;
  /**
   * stockId
   *
   */
  stockId: string;
  /**
   * saasId
   *
   */
  saasId: string;
  /**
   * spuId
   *
   */
  spuId: string;
  /**
   * skuId
   *
   */
  skuId: string;
}

interface IModalFhCartStock {
  /**
   * stockId
   *
   */
  stockId: string;
}

interface IModalFhCartSku {
  /**
   * skuId
   *
   */
  skuId?: string;
}

interface IModalFhCartSpu {
  /**
   * spuId
   *
   */
  spuId: string;
}

interface IModalFhGoodsSku {
  /**
   * 销售价格
   * 没有库存时，依据此价格来显示‘销售价格’
   */
  salePrice?: number;
  /**
   * spuId
   *
   */
  spuId?: string;
  /**
   * optionIdList
   *
   */
  optionIdList?: string[];
  /**
   * 图片
   *
   */
  imageList?: string[];
}

interface IModalFhGoodsSpu {
  /**
   * saasId
   *
   */
  saasId: string;
  /**
   * 名称
   *
   */
  title: string;
  /**
   * 分类
   *
   */
  cId?: string;
  /**
   * 描述
   *
   */
  desc?: string;
}

interface IModalFhSpecOption {
  /**
   * 名称
   *
   */
  title: string;
  /**
   * 规格
   *
   */
  sId: string;
}

interface IModalFhSaas {
  /**
   * 标识
   *
   */
  id?: string;
}

interface IModalFhOrderItem {
  /**
   * 数量
   *
   */
  quantity?: number;
}

interface IModalFhLabel {
  /**
   * 标签名称
   *
   */
  name: string;
}

interface IModalFhContact {}

interface IModalFhEntity {
  /**
   * 签名
   *
   */
  signature?: string;
  /**
   * 名称
   *
   */
  name: string;
  /**
   * 电话
   *
   */
  tel?: string;
  /**
   * 类型
   *
   */
  type?: string;
}

interface IModalFhOrder {
  /**
   * 订单编号
   *
   */
  dd_id?: string;
  /**
   * 类型
   * 0=入库单
   * 1=出库单
   */
  type: number;
  /**
   * 状态
   * 0=待下单
   * 1=已下单
   * 2=已完成
   */
  status?: number;
}

interface IModalFhStock {
  /**
   * 位置
   *
   */
  locaiton?: string;
  /**
   * 数量
   *
   */
  quantity?: number;
  /**
   * 原价
   *
   */
  originalPrice?: number;
  /**
   * 销售价格
   *
   */
  salePrice?: number;
  /**
   * 成本价格
   *
   */
  costPrice?: string;
  /**
   * skuId
   *
   */
  skuId?: string;
}

interface IModalFhGoods {
  /**
   * 商品编号
   *
   */
  sp_id?: string;
  /**
   * 商品名称
   *
   */
  name: string;
}

interface IModalFhUnit {
  /**
   * 单位名称
   *
   */
  name: string;
}

interface IModalFhSpec {
  /**
   * 标识
   *
   */
  id?: string;
  /**
   * 名称
   *
   */
  title: string;
  /**
   * 分类
   *
   */
  cId?: string;
}

interface IModalFhCategory {
  /**
   * saasId
   *
   */
  saasId?: string;
  /**
   * 禁用
   *
   */
  disabled?: number;
  /**
   * 名称
   *
   */
  title: string;
}

interface IModalDmxLvuok3K {}
interface IModalSysDepartment {}

interface IModalSysUser {}


interface IModels {

    /**
    * 数据模型：福和库存
    */ 
    fh_cart: DataModelMethods<IModalFhCart>;

    /**
    * 数据模型：福和库存stock
    */ 
    fh_cart_stock: DataModelMethods<IModalFhCartStock>;

    /**
    * 数据模型：福和库存SKU
    */ 
    fh_cart_sku: DataModelMethods<IModalFhCartSku>;

    /**
    * 数据模型：福和库存SPU
    */ 
    fh_cart_spu: DataModelMethods<IModalFhCartSpu>;

    /**
    * 数据模型：福和商品SKU
    */ 
    fh_goods_sku: DataModelMethods<IModalFhGoodsSku>;

    /**
    * 数据模型：福和商品SPU
    */ 
    fh_goods_spu: DataModelMethods<IModalFhGoodsSpu>;

    /**
    * 数据模型：福和规格选项
    */ 
    fh_spec_option: DataModelMethods<IModalFhSpecOption>;

    /**
    * 数据模型：福和Saas
    */ 
    fh_saas: DataModelMethods<IModalFhSaas>;

    /**
    * 数据模型：福和订单条目
    */ 
    fh_order_item: DataModelMethods<IModalFhOrderItem>;

    /**
    * 数据模型：福和标签
    */ 
    fh_label: DataModelMethods<IModalFhLabel>;

    /**
    * 数据模型：福和联系人
    */ 
    fh_contact: DataModelMethods<IModalFhContact>;

    /**
    * 数据模型：福和实体
    */ 
    fh_entity: DataModelMethods<IModalFhEntity>;

    /**
    * 数据模型：福和订单
    */ 
    fh_order: DataModelMethods<IModalFhOrder>;

    /**
    * 数据模型：福和库存
    */ 
    fh_stock: DataModelMethods<IModalFhStock>;

    /**
    * 数据模型：福和商品
    */ 
    fh_goods: DataModelMethods<IModalFhGoods>;

    /**
    * 数据模型：福和单位
    */ 
    fh_unit: DataModelMethods<IModalFhUnit>;

    /**
    * 数据模型：福和规格
    */ 
    fh_spec: DataModelMethods<IModalFhSpec>;

    /**
    * 数据模型：福和分类
    */ 
    fh_category: DataModelMethods<IModalFhCategory>;

    /**
    * 数据模型：大模型
    */ 
    dmx_lvuok3k: DataModelMethods<IModalDmxLvuok3K>;

    /**
    * 数据模型：部门
    */ 
    sys_department: DataModelMethods<IModalSysDepartment>;

    /**
    * 数据模型：用户
    */ 
    sys_user: DataModelMethods<IModalSysUser>;    
}

declare module "@cloudbase/wx-cloud-client-sdk" {
    interface OrmClient extends IModels {}
}

declare global {
    interface WxCloud {
        models: IModels;
    }
}