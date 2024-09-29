import services from '../../../../../services/index';
import log from '../../../../../utils/log';

module.exports = Behavior({
  methods: {
    onSideBarChange: function (e) {
      const { saasId } = this.data;
      const { value: selected } = e.detail;
      if (selected === services.category.addCategoryId) {
        this.showCategoryPopup((popup) => {
          popup.showAddCategory({ saasId });
        });
      } else if (selected === services.category.addGoodsId) {
        this.showGoodsPopup((popup) => {
          popup.showAddGoods({});
        });
      } else {
        this.setData({
          'category.selected': selected,
        });
      }
    },
    onSideBarItemLongPress: async function (e) {
      const { tag, saasId } = this.data;
      const { id: cId } = e.currentTarget.dataset;
      if (cId === services.category.allCategoryId) {
        log.info(tag, 'all category is not support long press');
      } else if (cId === services.category.addCategoryId) {
        this.showCategoryPopup((popup) => {
          popup.showAddCategory({ saasId });
        });
      } else {
        const args = { saasId };
        try {
          const [categoryRes, specsRes] = await Promise.all([
            services.category.crud.get({ tag, saasId, id: cId }),
            services.spec.crud.list({ tag, saasId, cId }),
          ]);
          args.category = categoryRes;
          args.specs = specsRes.records;
        } catch (error) {
          log.error(tag, 'showPopup', error);
          return;
        }
        this.showCategoryPopup((popup) => {
          popup.showEditCategory(args);
        });
        log.info(tag, 'onCategoryLongPressed', e);
      }
    },
  },
});
