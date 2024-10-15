export default {
  filterWhereFieldEq(params, field, value) {
    if (!params || !field || !value) return;
    params.filter = params.filter || {};
    params.filter.where = params.filter.where || {};
    params.filter.where[field] = { $eq: value };
  },
  filterWhereAndFieldEq(params, field, value) {
    if (!params || !field || !value) return;
    params.filter = params.filter || {};
    params.filter.where = params.filter.where || {};
    params.filter.where[$and] = params.filter.where[$and] || [];
  },
  filterRelateWhereWhereIdEq(params, model, id) {
    if (!params || !id || !model) return;
    params.filter = params.filter || {};
    params.filter.relateWhere = params.filter.relateWhere || {};
    params.filter.relateWhere[model] = {
      where: { _id: { $eq: id } },
    };
  },
};
