
import { DataModelMethods } from "@cloudbase/wx-cloud-client-sdk";
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

interface IModalFhSpecOptions {
  /**
   * 名称
   *
   */
  title: string;
  /**
   * 规格
   *
   */
  sId?: string;
}

interface IModalFhSpecItem {
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
  /**
   * saasId
   *
   */
  saasId: string;
  /**
   * 标识
   *
   */
  id?: string;
  /**
   * 分类
   *
   */
  cId: string;
}

interface IModalFhSaas {
  /**
   * 标识
   *
   */
  id?: string;
}

interface IModalFhGoodsItem {}

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
   * 库存编号
   *
   */
  kc_id?: string;
  /**
   * 数量
   *
   */
  quantity?: number;
  /**
   * 指导价格
   *
   */
  guide_price?: number;
  /**
   * 成本价格
   *
   */
  cost_price?: number;
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
    * 数据模型：福和规格选项
    */ 
    fh_spec_option: DataModelMethods<IModalFhSpecOption>;

    /**
    * 数据模型：福和规格选项
    */ 
    fh_spec_options: DataModelMethods<IModalFhSpecOptions>;

    /**
    * 数据模型：福和规格条目
    */ 
    fh_spec_item: DataModelMethods<IModalFhSpecItem>;

    /**
    * 数据模型：福和Saas
    */ 
    fh_saas: DataModelMethods<IModalFhSaas>;

    /**
    * 数据模型：福和商品条目
    */ 
    fh_goods_item: DataModelMethods<IModalFhGoodsItem>;

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