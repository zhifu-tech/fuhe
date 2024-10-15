const { default: log } = require('../log/log');

export function behaviors({ tag, debug, debugLifecycle, debugPageLifecycler }) {
  const behaviors = [];
  if (!debug || !_isDebugable()) return behaviors;
  if (debugLifecycle) {
    behaviors.push(_lifecycle(tag));
  }
  if (debugPageLifecycler) {
    behaviors.push(_pageLifecycle(tag));
  }
  return behaviors;
}

function _isDebugable() {
  const envVersion = wx.getAccountInfoSync().miniProgram.envVersion;
  return envVersion === 'trial' || envVersion === 'develop';
}

function _lifecycle(tag) {
  return Behavior({
    lifetimes: {
      created: () => log.info(tag, 'created'),
      attached: () => log.info(tag, 'attached'),
      detached: () => log.info(tag, 'detached'),
      ready: () => log.info(tag, 'ready'),
      moved: () => log.info(tag, 'moved'),
      detached: () => log.info(tag, 'detached'),
    },
  });
}

function _pageLifecycle(tag) {
  return Behavior({
    pageLifetimes: {
      show: () => log.info(tag, 'page show'),
      hide: () => log.info(tag, 'page hide'),
      resize: (size) => log.info(tag, 'page resize', size),
      routeDone: () => log.info(tag, 'page route done'),
    },
  });
}
