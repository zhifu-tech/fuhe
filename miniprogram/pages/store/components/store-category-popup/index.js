Component({
  options: {
    virtualHost: true,
  },
  behaviors: [
    require('./common/toasts'),
    require('./header/header'),
    require('./category/category'),
    require('./category/category-delete'),
    require('./category/category-input'),
    require('./category/category-input-action'),
    require('./spec/spec'),
    require('./spec/spec-delete'),
    require('./spec/spec-input'),
    require('./spec/spec-input-action'),
    require('./option/option'),
    require('./option/option-delete'),
    require('./option/option-input'),
    require('./option/option-input-action'),
  ],
  data: {
    tag: 'category-popup',
    visible: false,
    saasId: '',
    hasChanged: false,
  },
  methods: {
    showAddCategory: function ({ saasId }) {
      this.setData({
        visible: true,
        saasId,
        category: {},
        categoryInit: {},
        specs: [],
        specsInit: [],
      });
    },
    showEditCategory: function ({ saasId, category, specs }) {
      this.setData({
        visible: true,
        saasId,
        category: { ...category }, // 需要浅拷贝，可以修改
        categoryInit: category, // 记录原始信息，不可修改
        specs: [...specs], // 需要浅拷贝，可以修改
        specsInit: specs, // 记录原始信息，不可修改
        hasChanged: false,
      });
    },
    setHasChanged() {
      this.setData({
        hasChanged: true,
      });
    },
    hidePopup() {
      const { hasChanged } = this.data;
      this.triggerEvent('close', {
        hasChanged,
      });
      this.setData({
        visible: false,
        hasChanged: false,
      });
    },
  },
});
