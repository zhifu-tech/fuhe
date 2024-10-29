export function showGoodsAddSpuPopup(context, { callback }) {
  show(context, {
    isModeAddSpu: true,
    callback,
  });
}

export function showGoodsEditSpuPopup(context, { spu, callback }) {
  show(context, {
    isModeEditSpu: true,
    spu,
    callback,
  });
}

export function showGoodsAddSkuPopup(context, { spu, sku }) {
  show(context, {
    isModeAddSku: true,
    spu,
    sku,
  });
}

export function showGoodsEditSkuPopup(context, { spu, sku, callback }) {
  show(context, {
    isModeEditSku: true,
    spu,
    sku,
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
