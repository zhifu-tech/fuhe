import pages from '../page/pages';

export function showToastSuccess({ message, duration = 2000 }) {
  pages.currentPage().root().showSimpleToast({
    theme: 'success',
    message: message,
    duration,
  });
}

export function showToastError({ message, duration = 2000 }) {
  pages.currentPage().root().showSimpleToast({
    theme: 'error',
    message: message,
    duration,
  });
}

export function showToastWarning({ message, duration = 2000 }) {
  pages.currentPage().root().showSimpleToast({
    theme: 'warning',
    message: message,
    duration,
  });
}

export function showToastLoading({ message = '加载中', duration = -1 }) {
  pages.currentPage().root().showSimpleToast({
    theme: 'loading',
    message,
    duration,
  });
}

export function hideToastLoading() {
  pages.currentPage().root().hideSimpleToast();
}
