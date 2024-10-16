const { default: log } = require('@/common/log/log');
const { default: pages } = require('@/common/page/pages');
export default function ({ tag, visible, popupProps: { zIndex }, callback }) {
  if (visible) {
    if (zIndex === pages.zIndexPopup) {
      const zIndexIncr = pages.zIndexIncr();
      callback({
        zIndex: zIndexIncr,
        overlayProps: {
          zIndex: zIndexIncr - 500,
        },
      });
    }
    log.info(tag, 'show', pages.zIndex());
  } else {
    if (zIndex === pages.zIndex()) {
      pages.zIndexDecr();
    }
    if (zIndex !== pages.zIndexPopup) {
      callback({
        zIndex: pages.zIndexPopup,
        overlayProps: {
          zIndex: pages.zIndexOverlay,
        },
      });
      log.info(tag, 'hide', zIndex, pages.zIndex());
    }
  }
}
