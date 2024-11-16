import log from '@/common/log/log';
import entityStore from '../../stores/entity/index';
import entityService from '../../services/entity/index';
import { autorun } from 'mobx-miniprogram';

Component({
  behaviors: [
    require('miniprogram-computed').behavior,
    require('@/common/toast/simple'),
    require('./behaviors/add'),
  ],
  options: {
    pureDataPattern: /^_/,
  },
  properties: {
    title: String,
  },
  data: {
    list: [],
    indexList: [],
    stickyOffset: 0,
  },
  lifetimes: {
    attached: function () {
      const tag = 'entity-list';
      this._calStickyOffset();
      this.disposers = [
        autorun(() => {
          const entityList = entityStore.entityList;
          if (!entityList) {
            this.fetchEntityListTask?.cancel();
            this.fetchEntityListTask = entityService.fetchEntityList({
              tag,
              trigger: 'init',
              callback: () => null,
            });
            log.info(tag, 'fetchEntityListTask', this.fetchEntityListTask);
          } else {
            this._updateEntityIndexList({ tag, entityList });
          }
        }),
      ];
    },
    detached: function () {
      this.disposers.forEach((disposer) => disposer());
      this.disposers = [];
      this.fetchEntityListTask?.cancel();
      this.fetchEntityListTask = null;
    },
  },
  methods: {
    handleGoBack: wx.navigateBack(),
    handleSelect: function (e) {
      const { entityId } = e.target.dataset;
      this.getOpenerEventChannel().emit('pickedEntity', entityId);
      wx.navigateBack();
    },
    _calStickyOffset: function () {
      const query = wx.createSelectorQuery();
      query.select('.custom-navbar').boundingClientRect();
      query.exec((res) => {
        const { height = 0 } = res[0] || {};
        this.setData({ stickyOffset: height });
      });
    },
    _updateEntityIndexList: async function ({ tag, entityList }) {
      log.info(tag, 'entityList', entityList);
      const indexList = [];
      const list = [];
      let lastList = [];
      let lastLetter = '';
      entityList.forEach((entity) => {
        const letter = entity.camel[0];
        if (letter !== lastLetter) {
          indexList.push(letter);
          lastList = [];
          lastLetter = letter;
          list.push({
            index: letter,
            children: lastList,
          });
        }
        lastList.push(entity);
      });
      this.setData({
        list,
        indexList,
      });
    },
  },
});
