export function showGoodsAddSpuPopup(context) {
  show(context, {
    isModeAddSpu: true,
  });
}

export function showGoodsEditSpuPopup(context, { spuId }) {
  show(context, {
    isModeEditSpu: true,
    spuId,
  });
}

export function showGoodsAddSkuPopup(context, { spuId }) {
  show(context, {
    isModeAddSku: true,
    spuId,
  });
}

export function showGoodsEditSkuPopup(context, { spuId, skuId, callback }) {
  show(context, {
    isModeEditSku: true,
    spuId,
    skuId,
    callback,
  });
}

export function showGoodsEditStockPopup(context, { spuId, skuId, stockId }) {
  show(context, {
    isModeEditStock: true,
    spuId,
    skuId,
    stockId,
  });
}

export function showGoodsEditStockSuperPopup(context, { spuId, skuId, stockId }) {
  show(context, {
    isModeEditStockSuper: true,
    spuId,
    skuId,
    stockId,
  });
}

export function showGoodsAddStockPopup(context, { spu, sku, stock }) {
  show(context, {
    isModeAddStock: true,
    spu,
    sku,
    stock,
  });
}

export function show(context, options) {
  const close = options.close;
  options.close = (args) => {
    close?.(args);
    setTimeout(() => hide(context), 300);
  };
  context.setData({
    goodsPopup: {
      enabled: true,
      options,
    },
  });
}

export function hide(context) {
  context.setData({
    goodsPopup: {
      enabled: false,
    },
  });
}
