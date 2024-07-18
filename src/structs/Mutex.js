/**
 * A simple mutual exclusion lock (mutex) for synchronizing access to resources.
 */
export default class Mutex {
  /**
   * Indicates if the mutex is currently locked.
   * @type {boolean}
   * @private
   */
  locked = false;

  /**
   * A queue of resolve functions for promises waiting to acquire the lock.
   * @type {Function[]}
   * @private
   */
  queue = [];

  /**
   * Acquires the mutex lock. If the lock is already held, it returns a promise
   * that resolves when the lock is available.
   * @returns {Promise<void>|void} A promise that resolves when the lock is acquired,
   * or undefined if the lock is immediately acquired.
   */
  async acquire() {
    if (!this.locked) {
      this.locked = true;
      return;
    }

    return new Promise((resolve) => {
      this.queue.push(resolve);
    });
  }

  /**
   * Releases the mutex lock and resolves the next promise in the queue if there is one.
   */
  release() {
    if (this.queue.length > 0) {
      const resolve = this.queue.shift();
      resolve();
    } else {
      this.locked = false;
    }
  }
}
