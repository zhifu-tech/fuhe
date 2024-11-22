import log from '@/common/log/log';
import * as echarts from '../../ec-canvas/echarts';
import { autorun } from 'mobx-miniprogram';
import dashboardStore from '../../stores/dashboard/index';
import dashboardService from '../../services/dashboard/index';

module.exports = Behavior({
  behaviors: [require('miniprogram-computed').behavior],
  data: {
    income: {
      chart: null,
      active: 0,
      tags: dashboardStore.incomeData.tags,
    },
  },
  lifetimes: {
    attached: function () {
      this.data.income.onInit = this.initIncomeChart.bind(this);
      this.setData({
        income: this.data.income,
      });
    },
  },
  watch: {
    hostAttached: function () {
      const { tag } = this.data;
      this.addToAutoDisposable(
        autorun(() => {
          const incomeData = dashboardStore.incomeData;
          log.info(tag, 'syncIncomeData', 'attached', incomeData);
          this.setData({
            incomeSyncTime: incomeData.syncTimeFormatted,
          });
          this._showChart();
        }),
        autorun(() => {
          const incomeData = dashboardStore.incomeData;
          const syncTime = incomeData.syncTime;
          const syncInterval = incomeData.syncInterval;
          // 如果距离上次同步时间超过 阈值 分钟，就重新同步
          if (Date.now() - syncTime > syncInterval) {
            this.refreshIncomeData('auto-sync');
          }
        }),
      );
    },
  },
  methods: {
    refreshIncomeData: function (trigger) {
      this.addToAutoDisposable(
        dashboardService.syncIncomeData({
          tag: this.data.tag,
          trigger,
          callback: ({ code, error }) => {
            log.info(this.data.tag, 'syncIncomeData', trigger, 'callback', code, error);
            switch (code) {
              case 'loading': {
                if (trigger === 'pull-down') {
                  this.showPageLoadingWithPullDown();
                }
                break;
              }
              case 'success': {
                this.showPageNoMore();
                break;
              }
              case 'error': {
                this.showPageError(error);
              }
            }
          },
        }),
      );
    },
    initIncomeChart: function (canvas, width, height, dpr) {
      log.info('initChart', canvas, width, height, dpr, this);
      const chart = echarts.init(canvas, wx.getAppBaseInfo().theme, {
        width: width,
        height: height,
        devicePixelRatio: dpr,
      });
      this.data.income.chart = chart;
      canvas.setChart(chart);
      this._showChart();
      return chart;
    },
    handleIncomeTagClick: function (e) {
      const { index } = e.currentTarget.dataset;
      const { income } = this.data;
      if (index !== income.active) {
        this.setData({
          'income.active': index,
        });
        dashboardStore.incomeData.selected = index;
      }
    },
    _showChart: function () {
      const { income } = this.data;
      if (!income.chart) return;
      const { xAxis, data } = dashboardStore.incomeData.selected;
      if (!xAxis || !data) return;
      const options = {
        tooltip: { trigger: 'axis' },
        legend: { data: ['利润', '成本', '收入'] },
        xAxis: { type: 'category', data: xAxis() },
        yAxis: { type: 'value' },
        series: [
          {
            name: '利润',
            type: 'line',
            stack: 'Total',
            data: data.map(({ profit }) => profit),
          },
          {
            name: '成本',
            type: 'line',
            stack: 'Total',
            data: data.map(({ cost }) => cost),
          },
          {
            name: '收入',
            type: 'line',
            stack: 'Total',
            data: data.map(({ income }) => income),
          },
        ],
      };
      income.chart.clear();
      income.chart.setOption(options);
    },
  },
});
