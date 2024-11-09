export function showGoodsAddSpuPopup(context, { title }) {
  show(context, {
    isModeAddSpu: true,
    title,
  });
}

export function showGoodsEditSpuPopup(context, { spuId, title }) {
  show(context, {
    isModeEditSpu: true,
    spuId,
    title,
  });
}

export function showGoodsAddSkuPopup(context, { spuId, optionIdList, title }) {
  show(context, {
    isModeAddSku: true,
    spuId,
    optionIdList,
    title,
  });
}

export function showGoodsEditSkuPopup(context, { spuId, skuId, title }) {
  show(context, {
    isModeEditSku: true,
    spuId,
    skuId,
    title,
  });
}

export function showGoodsEditStockPopup(context, { spuId, skuId, stockId, title }) {
  show(context, {
    isModeEditStock: true,
    spuId,
    skuId,
    stockId,
    title,
  });
}

export function showGoodsEditStockSuperPopup(context, { spuId, skuId, stockId, title }) {
  show(context, {
    isModeEditStockSuper: true,
    spuId,
    skuId,
    stockId,
    title,
  });
}

export function showGoodsAddStockPopup(context, { spuId, skuId, title }) {
  show(context, {
    isModeAddStock: true,
    spuId,
    skuId,
  });
}

export function show(context, options) {
  context.setData({
    goodsPopup: {
      enabled: true,
      options: {
        ...options,
        close: () => {
          setTimeout(() => hide(context), 300);
        },
      },
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
