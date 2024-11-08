import pages from '@/common/page/pages';

export function showSimpleActionSheet({ items, theme = 'list' }) {
  pages.currentPage().showSimpleActionSheet({
    items,
    theme,
  });
}

export function hideSimpleActionSheet() {
  pages.currentPage().hideSimpleActionSheet();
}
