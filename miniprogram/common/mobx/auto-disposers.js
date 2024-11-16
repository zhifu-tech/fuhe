import log from '@/common/log/log';

module.exports = Behavior({
  data: {
    _disposers: [],
  },
  lifetimes: {
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
      this.dispose();
    },
  },
  methods: {
    addToAutoDisposable: function (...disposer) {
      disposer.forEach((disposer) => {
        if (typeof disposer.key === 'string') {
          // 过滤掉，具有相同key的
          this.data._disposers = this.data._disposers.filter((d) => {
            if (d.key === disposer.key) {
              this._dispose(d);
              return false;
            } else {
              return true;
            }
          });
        }
        this.data._disposers.push(disposer);
      });
    },
    dispose: function () {
      this.data._disposers.forEach((d) => this._dispose(d));
      this.disposers = null;
    },
    _dispose: function (d) {
      try {
        if (typeof d === 'function') {
          return d();
        } else if (typeof d.dispose === 'function') {
          return d.dispose();
        } else if (typeof d.cancel === 'function') {
          return d.cancel();
        } else if (typeof d.disposer === 'function') {
          return d.disposer();
        } else if (d.disposer && typeof d.disposer.dispose === 'function') {
          return d.disposer.dispose();
        } else {
          log.error('invalid disposer', d);
        }
      } catch (error) {
        log.error('dispose error', error, d);
      }
    },
  },
});
