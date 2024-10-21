import pages from '@/common/page/pages';

export function showSimpleActionSheet({ items, theme = 'list', selected, close }) {
  pages.currentPage().root()?.showSimpleActionSheet({
    options: {
      items,
      theme,
    },
    selected,
    close,
  });
}

export function hideSimpleActionSheet() {
  pages.currentPage().root()?.hideSimpleActionSheet();
}
