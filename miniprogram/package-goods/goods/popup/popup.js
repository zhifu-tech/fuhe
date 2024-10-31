export function showGoodsAddSpuPopup(context, { callback }) {
  show(context, {
    isModeAddSpu: true,
    callback,
  });
}

export function showGoodsEditSpuPopup(context, { spuId, callback }) {
  show(context, {
    isModeEditSpu: true,
    spuId,
    callback,
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

export function showGoodsEditStockPopup(context, { spu, sku, stock, callback }) {
  show(context, {
    isModeEditStock: true,
    spu,
    sku,
    stock,
    callback,
  });
}

export function showGoodsEditStockSuperPopup(context, { spu, sku, stock, callback }) {
  show(context, {
    isModeEditStockSuper: true,
    spu,
    sku,
    stock,
    callback,
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
