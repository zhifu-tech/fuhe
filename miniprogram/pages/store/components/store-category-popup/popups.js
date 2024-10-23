import pages from '../../../../common/page/pages';

export function showCategoryPopup(args) {
  pages.currentPage().showCategoryPopup(args);
}

export function hideCategoryPopup() {
  pages.currentPage().hideCategoryPopup();
}
