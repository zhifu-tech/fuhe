import log from '@/common/log/log';

export default function ({ tag, stock, index, salePrice, saleQuantity, executeFn }) {
  const task = new CartChangeTask(tag, stock, index, salePrice, saleQuantity, executeFn);
  cartChangeHandler.enqueue(task);
}

// 创建一个类来控制队列状态
class CartChangeHandler {
  constructor() {
    this.queue = []; // 队列，用来存储即将执行的操作
    this.isProcessing = false; // 用来标记是否正在处理队列
    this.currentTask = null; // 当前正在处理的任务
  }

  // 添加新的变更任务到队列中
  enqueue(task) {
    const { stock, index, salePrice, saleQuantity } = task;
    this.queue = this.queue.filter((_task) => {
      // 移除队列中，stock._id相同的，且index相同的变更任务
      const match = _task.stock._id === stock._id && _task.index === index;
      if (match) {
        // 如果当前正在处理的任务，取消该任务
        if (_task === this.currentTask) {
          this.currentTask = null;
          _task.cancel();
          log.info('cart-change-handler', 'canceled', _task);
        }
        log.info('cart-change-handler', 'removed', _task);
        return false;
      }
      return true;
    });
    // 添加新的任务
    this.queue.push(task);
    log.info('cart-change-handler', 'enqueue', this.queue.length, task);

    // 如果没有正在处理的任务，开始处理
    if (!this.isProcessing) {
      // 延迟执行，防抖处理
      clearTimeout(this.delayTimeout);
      this.delayTimeout = setTimeout(() => this.processNext(), 2000);
    }
  }

  // 处理下一个任务
  async processNext() {
    log.info('cart-change-handler', 'processNext', task);
    if (this.queue.length === 0) {
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;
    const task = this.queue.shift();
    this.currentTask = task;

    try {
      await task.execute();
    } catch (error) {
      if (error.message !== 'TASK_CANCELLED') {
        console.error('Error in task execution:', error);
      }
    } finally {
      this.currentTask = null;
      this.isProcessing = false;
      if (this.queue.length > 0) {
        clearTimeout(this.delayTimeout);
        this.delayTimeout = setTimeout(() => this.processNext(), 2000);
      }
    }
  }
}

class CartChangeTask {
  constructor(tag, stock, index, salePrice, saleQuantity, executeFn) {
    this.tag = tag;
    this.stock = stock;
    this.index = index;
    this.salePrice = salePrice;
    this.saleQuantity = saleQuantity;
    this.executeFn = executeFn;
    this.cancelled = false;
  }

  // 执行任务的函数
  async execute() {
    if (this.cancelled) throw new Error('TASK_CANCELLED');
    await this.executeFn(this);
  }

  // 取消任务
  cancel() {
    this.cancelled = true;
  }
}

const cartChangeHandler = new CartChangeHandler();
