import log from '../../../utils/log';

export default function () {
  const dataCache = new Map(); // <key:category_id, value:{}>
  const specCache = new Map(); // <key:categroy_spec_id, spec>
  return {
    reset: function () {
      dataCache.clear();
      specCache.clear();
    },
    getSpec: function (categoryId, specId) {
      return dataCache.get(categoryId)?.specs?.find(({ _id }) => _id === specId);
    },
    getSpecData: function (categoryId) {
      return dataCache.get(categoryId);
    },
    setSpecData: function (categoryId, data) {
      return dataCache.set(categoryId, data);
    },
    setSpecListToCache: function (list) {
      list?.forEach((spec) => {
        spec?.category_spec?.forEach(({ _id: csId }) => {
          specCache.set(csId, spec);
        });
      });
    },
    getSpecListFromCache: function (csIds, needNoCache = false) {
      const cached = [];
      const noCached = needNoCache ? [] : null;
      csIds.forEach((csId) => {
        const spec = specCache.get(csId);
        if (!spec || spec === null) {
          noCached?.push(csId);
        } else {
          cached.push(spec);
        }
      });
      return { cached, noCached };
    },
    updateSpecSelected: function (categoryId, specId) {
      const last = this.getSpecData(categoryId);
      if (last && last != null) {
        last.selected = specId;
      }
    },
  };
}

export function toSpecItems(records) {
  const items = records.map((spec) => ({
    label: spec.name,
    value: spec._id,
  }));
  if (items.length > 1) {
    items.unshift({
      label: '所有规格',
      value: allSpecId(),
    });
  }
  items.push({
    label: '新增规格',
    value: '0',
  });
  return items;
}

export function allSpecId() {
  return '1';
}
export function isAllSpec(spedId) {
  return spedId === allSpecId();
}
