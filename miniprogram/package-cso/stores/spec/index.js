import log from '@/common/log/log';
import { observable, action } from 'mobx-miniprogram';

export default (function store() {
  const tagStore = 'spec-store';
  return observable({
    specListMap: new Map(), // map<cId, specList>

    //***************** 规格 **********************
    getSpecList: function (cId) {
      return this.specListMap.get(cId);
    },
    setSpecList: action(function (cId, specList) {
      this.specListMap.set(cId, specList);
    }),
    addSpecList: action(function (cId, specList) {
      const list = this.specListMap.get(cId) || [];
      list.push(...specList);
      this.specListMap.set(cId, list);
    }),
    updateSpecList: action(function (cId, specList) {
      const list = this.specListMap.get(cId) || [];
      list.forEach((spec) => {
        const updated = specList.find(({ _id }) => _id === spec._id);
        spec.title = (updated && updated.title) || spec.title;
      });
      this.specListMap.set(cId, list);
    }),
    deleteSpecList: action(function (cId, specIdList) {
      const list = this.specListMap.get(cId);
      if (!list) return;
      specIdList.forEach((specId) => {
        const index = list.findIndex((spec) => spec._id === specId);
        if (index !== -1) {
          list.splice(index, 1);
        }
      });
      this.specListMap.set(cId, list);
    }),

    //***************** 选项 **********************
    addSpecOptionList: action(function ({ cId, optionList }) {
      const specList = this.specListMap.get(cId);
      if (!specList) {
        log.info(tag, specStore, 'addSpecOptionList', 'specList not found');
        return;
      }
      log.info(tag, specStore, 'addSpecOptionList');
      optionList.forEach((option) => {
        const spec = specList.find((it) => it._id === option.sId);
        if (!spec) return;
        spec.optionList = spec.optionList || [];
        const index = spec.optionList.findIndex(({ _id }) => _id === option._id) || -1;
        if (index !== -1) {
          spec.optionList[index] = option;
        } else {
          spec.optionList.push(option);
        }
      });
      this.specListMap.set(cId, specList);
    }),
    updateSpecOptionList: action(function ({ tag, cId, optionList }) {
      const specList = this.specListMap.get(cId);
      if (!specList) {
        log.info(tag, specStore, 'updateSpecOptionList', 'specList not found');
        return;
      }
      log.info(tag, specStore, 'updateSpecOptionList');
      optionList.forEach((option) => {
        const spec = specList.find((it) => it._id === option.sId);
        if (!spec) return;
        spec.optionList = spec.optionList || [];
        const index = spec.optionList.findIndex(({ _id }) => _id === option._id) || -1;
        if (index !== -1) {
          spec.optionList[index] = option;
        } else {
          spec.optionList.push(option);
        }
      });
      this.specListMap.set(cId, specList);
    }),
    deleteSpecOptionList: action(function ({ cId, optionList }) {
      const specList = this.specListMap.get(cId);
      if (!specList) {
        log.info(tag, specStore, 'deleteSpecOptionList', 'specList not found');
        return;
      }
      log.info(tag, specStore, 'deleteSpecOptionList');
      optionList.forEach((option) => {
        const spec = specList.find((it) => it._id === option.sId);
        if (!spec) return;
        spec.optionList = spec.optionList || [];
        const index = spec.optionList.findIndex(({ _id }) => _id === option._id) || -1;
        if (index !== -1) {
          spec.optionList.splice(index, 1);
        }
      });
      this.specListMap.set(cId, specList);
    }),
  });
})();
