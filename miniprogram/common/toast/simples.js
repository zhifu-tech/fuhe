import pages from '../page/pages';

export function showToastSuccess({ message, duration = 2000 }) {
  pages.currentPage().root().showSimpleToast({
    theme: 'success',
    message: message,
    duration,
  });
}

export function showToastError({ message = '未知错误，请稍后再试！', duration = 2000 }) {
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
  if (pages && pages.currentPage && pages.currentPage().root) {
    pages.currentPage().root().showSimpleToast({
      theme: 'loading',
      message,
      duration,
    });
  } else {
    console.error('pages or its methods are not properly defined.');
  }
}

export function hideToastLoading() {
  pages.currentPage().root().hideSimpleToast();
}
