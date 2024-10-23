import pages from '../../../../common/page/pages';

export function showGoodsAddSpuPopup({ callback }) {
  pages.currentPage()?.root()?.showGoodsPopup({
    isModeAddSpu: true,
    callback,
  });
}

export function showGoodsEditSpuPopup({ spu, callback }) {
  pages.currentPage()?.root()?.showGoodsPopup({
    isModeEditSpu: true,
    spu,
    callback,
  });
}

export function showGoodsAddSkuPopup({ spu, sku }) {
  pages.currentPage()?.root()?.showGoodsPopup({
    isModeAddSku: true,
    spu,
    sku,
  });
}

export function showGoodsEditSkuPopup({ spu, sku, callback }) {
  pages.currentPage()?.root()?.showGoodsPopup({
    isModeEditSku: true,
    spu,
    sku,
    callback,
  });
}

export function showGoodsEditStockPopup({ spu, sku, stock, callback }) {
  pages.currentPage()?.root()?.showGoodsPopup({
    isModeEditStock: true,
    spu,
    sku,
    stock,
    callback,
  });
}

export function showGoodsEditStockSuperPopup({ spu, sku, stock, callback }) {
  pages.currentPage()?.root()?.showGoodsPopup({
    isModeEditStockSuper: true,
    spu,
    sku,
    stock,
    callback,
  });
}
