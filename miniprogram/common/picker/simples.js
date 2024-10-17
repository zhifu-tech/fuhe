import pages from '../page/pages';

export function showSimpePicker(options) {
  pages.currentPage().root()?.showSimpePicker(options);
}
