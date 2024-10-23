import pages from '../page/pages';

export function showToastSuccess({ message, duration = 2000 }) {
  pages.currentPage().showSimpleToast({
    theme: 'success',
    message: message,
    duration,
  });
}

export function showToastError({ message = '未知错误，请稍后再试！', duration = 2000 }) {
  pages.currentPage().showSimpleToast({
    theme: 'error',
    message: message,
    duration,
  });
}

export function showToastWarning({ message, duration = 2000 }) {
  pages.currentPage().showSimpleToast({
    theme: 'warning',
    message: message,
    duration,
  });
}

export function showToastLoading({ message = '加载中', duration = -1 }) {
  pages.currentPage().showSimpleToast({
    theme: 'loading',
    message,
    duration,
  });
}

export function hideToastLoading() {
  pages.currentPage().hideSimpleToast();
}
