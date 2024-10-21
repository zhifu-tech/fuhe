import pages from '../page/pages';

export function showSimpePicker(args) {
  pages.currentPage().root()?.showSimpePicker(args);
}
