const { default: log } = require('../log/log');
const { default: pages } = require('../page/pages');

module.exports = Behavior({
  data: {
    popupProps: {
      zIndex: pages.zIndexPopup,
      overlayProps: {
        zIndex: pages.zIndexOverlay,
      },
    },
  },
  observers: {
    visible: function () {
      const {
        tag,
        visible,
        popupProps: { zIndex },
      } = this.data;
      log.info(tag, 'popup visible', visible);
      if (visible) {
        if (zIndex === pages.zIndexPopup) {
          const zIndexIncr = pages.zIndexIncr();
          this.setData({
            'popupProps.zIndex': zIndexIncr,
            'popupProps.overlayProps.zIndex': zIndexIncr - 500,
          });
          log.info(tag, 'show', pages.zIndex());
        }
      } else {
        if (zIndex === pages.zIndex()) {
          pages.zIndexDecr();
        }
        if (zIndex !== pages.zIndexPopup) {
          this.setData({
            'popupProps.zIndex': pages.zIndexPopup,
            'popupProps.overlayProps.zIndex': pages.zIndexOverlay,
          });
          log.info(tag, 'hide', zIndex, pages.zIndex());
        }
      }
    },
  },
});
