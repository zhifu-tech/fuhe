import log from '../../../utils/log';

Component({
  behaviors: [
    require('./store/behaviors/store-sidebar'), // 侧边栏
    require('./store-category'), // 分类
    require('./store/behaviors/store-spec'), // 规格信息
  ],
  data: {
    tag: 'storePage',
    saasId: '666666',
  },
  pageLifetimes: {
    show() {
      this._init();
    },
  },

  methods: {
    _init: function () {
      this._initCategory(); // 初始化分类信息
      this._initSpec(); //初始化规格信息
    },
  },
});
