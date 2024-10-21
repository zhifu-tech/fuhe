import pages from '../../../../common/page/pages';

export function showCategoryPopup(args) {
  pages.currentPage().root()?.showCategoryPopup(args);
}

export function hideCategoryPopup() {
  pages.currentPage().root()?.hideCategoryPopup();
}
