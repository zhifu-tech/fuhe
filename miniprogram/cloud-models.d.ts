
import { DataModelMethods } from "@cloudbase/wx-cloud-client-sdk";
interface IModalFhGoodsSpec {}

interface IModalFhGoodsCategory {}

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

interface IModalFhCategorySpec {}

interface IModalFhStock {
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
   * 规格名称
   *
   */
  name: string;
}

interface IModalFhCategory {
  /**
   * 是否启用
   *
   */
  is_enabled?: boolean;
  /**
   * 类型编号
   *
   */
  lx_id?: string;
  /**
   * 分类名称
   *
   */
  name: string;
}

interface IModalDmxLvuok3K {}
interface IModalSysDepartment {}

interface IModalSysUser {}


interface IModels {

    /**
    * 数据模型：福和商品规格
    */ 
    fh_goods_spec: DataModelMethods<IModalFhGoodsSpec>;

    /**
    * 数据模型：福和商品分类
    */ 
    fh_goods_category: DataModelMethods<IModalFhGoodsCategory>;

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
    * 数据模型：福和分类规格
    */ 
    fh_category_spec: DataModelMethods<IModalFhCategorySpec>;

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