import log from '@/common/log/log';

export default function enqueueCartChange({ options, executeFn }) {
  cartChangeHandler.enqueue(new CartChangeTask(options, executeFn));
}

// 创建一个类来控制队列状态
class CartChangeHandler {
  constructor() {
    this.queue = []; // 队列，用来存储即将执行的操作
    this.isProcessing = false; // 用来标记是否正在处理队列
  }

  // 添加新的变更任务到队列中
  enqueue(task) {
    this.queue = this.queue.filter((_task) => {
      const match = _task.options.stockId === task.options.stockId;
      if (match) {
        _task.cancel(); // 标记为取消，并且通过filter移除
        log.info('cart-change-handler', 'removed', _task);
        return false;
      }
      return true;
    });

    this.queue.push(task); // 添加新的任务
    log.info('cart-change-handler', 'enqueue', this.queue.length, task);

    // 如果没有正在处理的任务，开始处理
    if (!this.isProcessing) {
      // 这里增加防抖处理
      clearTimeout(this.delayTimeout);
      this.delayTimeout = setTimeout(() => this.processNext(), 300);
    }
  }

  // 处理下一个任务
  async processNext() {
    if (this.queue.length === 0) {
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;
    const task = this.queue[0];

    try {
      log.info('cart-change-handler', 'execute-start', task);
      await task.execute();
      log.info('cart-change-handler', 'execute-end', task, this.queue.length);
    } catch (error) {
      if (error.message === 'TASK_CANCELLED') {
        log.info('cart-change-handler', 'execute-cancelled', task);
      } else {
        log.error('Error in task execution:', error);
        throw error;
      }
    } finally {
      this.isProcessing = false;
      // 最后移除队列中的任务，可能在执行的过程中，被其它地方移除。这里需要增加一个判定。
      if (task === this.queue[0]) {
        this.queue.shift();
      }
      if (this.queue.length > 0) {
        clearTimeout(this.delayTimeout);
        this.delayTimeout = setTimeout(() => this.processNext(), 2000);
      }
    }
  }
}

class CartChangeTask {
  constructor(options, executeFn) {
    this.options = options;
    this.executeFn = executeFn;
    this.cancelled = false;
  }

  // 执行任务的函数
  async execute() {
    if (this.cancelled) throw new Error('TASK_CANCELLED');
    await this.executeFn(this.options);
  }

  // 取消任务
  cancel() {
    this.cancelled = true;
  }
}

const cartChangeHandler = new CartChangeHandler();
