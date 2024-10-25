module.exports = Behavior({
  data: {
    mode: 'fab',
  },
  methods: {
    handleSwitchMode: function () {
      const { mode } = this.data;
      if (mode === 'fab') {
        this.setData({ mode: 'popup' });
        this.selectComponent('#cart-popup').setData({ visible: true });
      } else {
        this.selectComponent('#cart-popup').setData({ visible: false });
        setTimeout(() => this.setData({ mode: 'fab' }), 240);
      }
    },
  },
});
