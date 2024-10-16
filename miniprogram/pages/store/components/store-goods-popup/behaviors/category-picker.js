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
        ?.showSimpePicker({
          selected: selected?._id || '',
          items,
          confirm: this._onCategoryPickerConfirm.bind(this),
        });
    },
    _onCategoryPickerConfirm: function ({ value: cId, data }) {
      const { tag } = this.data;
      if (cId !== '0') {
        this.handleUpdateSpuCategory(data);
        log.info(tag, 'category-picker', 'confirm');
        return;
      }
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
    },
  },
});
