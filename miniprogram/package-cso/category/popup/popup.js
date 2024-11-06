export function show(context, { cId }) {
  context.setData({
    categoryPopup: {
      enabled: true,
      options: {
        ...(cId !== undefined && { cId }),
        close: (args) => {
          setTimeout(() => hide(context), 300);
        },
      },
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
