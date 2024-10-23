import pages from '../page/pages';

export function showConfirmDialog({
  title = '',
  content = '',
  confirmBtn = '确定',
  cancelBtn = '取消',
  buttonLayout = 'horizontal',
  showOverlay = true,
  closeOnOverlayClick = true,
  preventScrollThrough = true,
  confirm,
  cancel,
}) {
  showSimpleDialog({
    options: {
      title,
      content,
      confirmBtn,
      cancelBtn,
      buttonLayout,
      showOverlay,
      closeOnOverlayClick,
      preventScrollThrough,
    },
    confirm,
    cancel,
  });
}

export function showSimpleDialog({ options, confirm = null, cancel = null, action = null }) {
  pages.currentPage().showSimpleDialog({ options, confirm, cancel, action });
}

export function hideSimpleDialog() {
  pages.currentPage().hideSimpleDialog();
}
