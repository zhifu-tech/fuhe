export function show(context, options) {
  const close = options.close;
  options.close = (args) => {
    close?.(args);
    hide(context);
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
