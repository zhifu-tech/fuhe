import services from '../../../../../services/index';
import log from '../../../../../common/log/log';

module.exports = Behavior({
  data: {
    spec: {
      selected: '',
      items: [],
    },
  },
  methods: {
    _initSpec: function () {
      services.spec.cache.reset();
    },
  },
});
