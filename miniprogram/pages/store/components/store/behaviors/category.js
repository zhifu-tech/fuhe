import services from '../../../../../services/index';
import log from '../../../../../common/log/log';

module.exports = Behavior({
  data: {
    category: {
      selected: '',
      items: [],
    },
  },
  methods: {
    _initCategory: async function () {
      services.spec.cache.reset();
      services.category.cache.reset();
      const { tag, saasId } = this.data;
      const res = await this._fetchCategoryList({ tag, saasId, pageNumber: 1, refresh: false });
      this.setData({
        'category.items': res.items,
        'category.selected': res.selected,
      });
    },
    _fetchCategoryList: async function ({ tag, saasId, pageNumber, refresh }) {
      try {
        const { records, total } = await services.category.crud.list({
          tag,
          saasId,
          pageNumber,
          loadFromCacheEnabled: !refresh,
        });
        const data = {
          items: this._toCategoryItems(records),
          total,
          pageNumber: 1,
        };
        data.selected = data.items[0].value;
        return data;
      } catch (error) {
        log.error(tag, 'fetchCategoryList', error);
        throw error;
      }
    },
    /**数据转换：将原始数据，转换为用来展示的items */
    _toCategoryItems: (list) => {
      const items = list.map((category) => ({
        label: category.title,
        value: category._id,
        badgeProps: {},
      }));
      if (items.length > 1) {
        items.unshift({
          label: '所有商品',
          value: services.category.allCategoryId,
          badgeProps: {},
        });
      }
      items.push({
        label: '新增分类',
        value: services.category.addCategoryId,
        badgeProps: {},
      });
      return items;
    },
  },
});
