export default class Disposable {
  constructor() {
    this.isDisposed = false;
  }
  dispose() {
    this.isDisposed = true;
  }
  checkDisposed() {
    if (this.isDisposed) {
      throw new Error('TASK_DISPOSABLED');
    }
  }
}
