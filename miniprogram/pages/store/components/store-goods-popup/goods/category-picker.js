const { default: log } = require('../../../../../common/log/log');
const { default: pages } = require('../../../../../common/page/pages');
const { default: services } = require('../../../../../services/index');

module.exports = Behavior({
  methods: {
    showCategoryPicker: async function () {
      const {
        tag,
        saasId,
        spu: { category },
      } = this.data;
      const { records: categories } = await services.category.crud.list({
        tag,
        saasId,
        pageNumber: 1,
        loadFromCacheEnabled: true,
      });
      const items = categories.map((it) => ({
        label: it.title,
        value: it._id,
        data: it,
      }));
      items.push({
        label: '新增商品类别',
        value: '0',
      });
      const selected =
        (category && category._id && categories.find(({ _id }) => _id === category._id)) || '';
      pages
        .currentPage()
        .store()
        ?.showPicker({
          selected: selected?._id || '',
          items,
          confirm: this._onCategoryPickerConfirm.bind(this),
        });
    },
    _onCategoryPickerConfirm: function (e) {
      const { tag } = this.data;
      const { label, value, columns } = e.detail;
      const cId = value && value.length > 0 && value[0];
      log.info(tag, 'category-picker', 'confirm', label, cId);
      if (cId === '0') {
        pages
          .currentPage()
          .store()
          ?.showCategoryPopup({
            close: ({ hasChanged, category }) => {
              log.info(tag, 'category-picker', 'hasChanged', hasChanged, category);
              if (hasChanged && category) {
                this.handleUpdateSpuCategory(category);
              }
            },
          });
        log.info(tag, 'category-picker', 'showCategoryPopup');
      } else {
        const { items } = e.currentTarget.dataset;
        const { index } = columns[0];
        const item = items[index];
        this.handleUpdateSpuCategory(item.data);
        log.info(tag, 'category-picker', 'confirm', item);
      }
    },
  },
});
