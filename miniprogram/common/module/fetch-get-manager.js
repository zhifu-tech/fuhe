export default function fetchGetManager(moduleLoader, manager = {}) {
  manager['_props'] = {};
  return Object.entries(moduleLoader).reduce((manager, [module, loader]) => {
    const fetcher = `fetch${module.charAt(0).toUpperCase() + module.slice(1)}`;
    manager[fetcher] = async function () {
      if (!this._props[module]) {
        try {
          const res = await loader();
          this._props[module] = res.default;
        } catch (error) {
          console.error('services', `加载 ${module} 服务失败`, error);
          this._props[module] = null;
        }
      }
      return this._props[module];
    };

    Object.defineProperty(manager, module, {
      get: function () {
        if (!this._props[module]) {
          this[fetcher]();
        }
        return this._props[module] || {};
      },
    });
    console.log('manager', manager);
    return manager;
  }, manager);
}
