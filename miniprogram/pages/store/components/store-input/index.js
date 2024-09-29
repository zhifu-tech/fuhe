import log from '../../../../utils/log';

Component({
  options: {
    virtualHost: true,
  },
  externalClasses: ['input-class'],
  properties: {
    tips: {
      type: String,
      value: '',
    },
    value: {
      type: String,
      value: '',
    },
    action: {
      type: String,
      value: '',
    },
  },
  data: {
    tag: 'input',
    hasFocus: false,
    inputValue: null,
    actionDisabled: true,
    enterTimeout: null,
  },
  observers: {
    inputValue: function () {
      const { inputValue, value, actionDisabled } = this.data;
      const disabled = !inputValue || inputValue === value;
      if (actionDisabled !== disabled) {
        this.setData({
          actionDisabled: disabled,
        });
      }
    },
  },
  methods: {
    onChange: function (e) {
      this.setData({
        inputValue: e.detail.value || '',
      });
    },
    onBlur: function (e) {
      this.data.hasFocus = true;
      this.setData({
        inputValue: e.detail.value || '',
      });
    },
    onFocus: function () {
      this.data.hasFocus = true;
    },
    onEnter: function (e) {
      const { tag, enterTimeout, hasFocus, actionDisabled, inputValue } = this.data;
      if (enterTimeout) return;
      this.data.enterTimeout = setTimeout(() => {
        this.data.enterTimeout = 0;
      }, 1000);
      if (!hasFocus || actionDisabled) return;
      log.info(tag, 'action triggered by enter');
      this.triggerEvent('action', {
        value: inputValue || '',
        callback: this._onActionResult.bind(this),
      });
    },
    onAction: function () {
      const { tag, actionDisabled, inputValue } = this.data;
      if (actionDisabled) return;
      log.info(tag, 'action triggered by button');
      this.triggerEvent('action', {
        value: inputValue || '',
        callback: this._onActionResult.bind(this),
      });
    },
    _onActionResult: function ({ tips, value, action }) {
      if (tips || value != undefined || action) {
        const postData = {};
        if (tips) postData.tips = tips;
        if (value != undefined) postData.value = value || '';
        if (action) postData.action = action;
        this.setData(postData);
      }
    },
  },
});
