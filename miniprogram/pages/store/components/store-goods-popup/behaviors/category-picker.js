const { default: log } = require('../../../../../common/log/log');
const { default: services } = require('../../../../../services/index');
const { showSimpePicker } = require('../../../../../common/picker/simples');
import { showCategoryPopup } from '../../store-category-popup/popups';

module.exports = Behavior({
  methods: {
    showCategoryPicker: async function () {
      const {
        tag,
        saasId,
        spu: { category },
      } = this.data;
      const { records: categories } = await services.category.list({
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
      showSimpePicker({
        title: '选择商品类别',
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
      showCategoryPopup({
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
