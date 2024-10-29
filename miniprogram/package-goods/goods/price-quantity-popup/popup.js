export function show(context, options) {
  const close = options.close;
  options.close = (args) => {
    close?.(args);
    setTimeout(() => hide(context), 300);
  };
  context.setData({
    priceQuantityPopup: {
      enabled: true,
      options,
    },
  });
}

export function hide(context) {
  context.setData({
    'priceQuantityPopup.enabled': false,
  });
}
