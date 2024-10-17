import pages from '@/common/page/pages';

export function showSimpleActionSheet(args) {
  pages.currentPage().root()?.showSimpleActionSheet(args);
}

export function hideSimpleActionSheet() {
  pages.currentPage().root()?.hideSimpleActionSheet();
}
