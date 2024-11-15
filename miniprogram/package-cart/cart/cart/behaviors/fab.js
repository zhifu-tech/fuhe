import cartStore from '../../../stores/cart/index';
import { autorun } from 'mobx-miniprogram';

module.exports = Behavior({
  data: {
    showCartFab: false,
  },
  lifetimes: {
    attached: function () {
      this.addToAutoDisposable(
        autorun(() => {
          if (cartStore.dataList.length > 0 && !this.data.showCartFab) {
            this.setData({ showCartFab: true });
          } else if (cartStore.dataList.length === 0 && this.data.showCartFab) {
            this.setData({ showCartFab: false });
          }
        }),
      );
    },
  },
});
