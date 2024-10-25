module.exports = Behavior({
  observers: {
    price: function format(value) {
      const { prices, priceUnit, autoFill } = this.data;
      let price = parseFloat(`${value}`);
      if (isNaN(price)) {
        this.setData({ prices });
        return;
      }
      prices.formatted = price;
      const isMinus = price < 0;
      if (isMinus) price = -price;
      if (priceUnit === 'yuan') {
        const values = price.toString().split('.');
        prices.integer = values[0];
        prices.decimal = !values[1] ? '00' : values[1].length === 1 ? `${values[1]}0` : values[1];
      } else {
        // 恢复精度丢失
        price = Math.round(price * 10 ** 8) / 10 ** 8;
        price = Math.ceil(price); // 向上取整
        prices.integer = price >= 100 ? `${price}`.slice(0, -2) : '0';
        prices.decimal = `${price + 100}`.slice(-2);
      }
      if (!autoFill) {
        // 如果 fill 为 false， 不显示小数末尾的0
        if (prices.decimal === '00') {
          prices.decimal = '';
        } else if (prices.decimal[1] === '0') {
          prices.decimal = prices.decimal[0];
        }
      }
      if (isMinus) {
        prices.integer = `-${prices.integer}`;
      }
      this.setData({ prices });
    },
  },
});
