export function show(context, options) {
  const close = options.close;
  options.close = (args) => {
    close?.(args);
    setTimeout(() => hide(context), 300);
  };
  context.setData({
    categoryPopup: {
      enabled: true,
      options,
    },
  });
}

export function hide(context) {
  context.setData({
    categoryPopup: {
      enabled: false,
    },
  });
}
