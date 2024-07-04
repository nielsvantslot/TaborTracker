/**
 * Class representing a notifier for managing subscriptions.
 */
export default class Notifier {
  /** @type {Set<Function>} */
  #subscribers;

  /**
   * Create a Notifier.
   */
  constructor() {
    this.#subscribers = new Set();
  }

  /**
   * Subscribe a new function to the notifier.
   * @param {Function} subscriber - The function to be subscribed.
   * @throws {Error} Throws an error if the argument is not a function.
   */
  subscribe(subscriber) {
    if (typeof subscriber !== "function") {
      throw new Error(
        `${typeof subscriber} is not a valid argument for the subscribe method, expected a function instead`
      );
    }
    this.#subscribers.add(subscriber);
  }

  /**
   * Unsubscribe a function from the notifier.
   * @param {Function} subscriber - The function to be unsubscribed.
   * @throws {Error} Throws an error if the argument is not a function.
   */
  unsubscribe(subscriber) {
    if (typeof subscriber !== "function") {
      throw new Error(
        `${typeof subscriber} is not a valid argument for the unsubscribe method, expected a function instead`
      );
    }
    this.#subscribers.delete(subscriber);
  }

  /**
   * Publish a payload to all subscribed functions.
   * @param {*} payload - The data to be sent to the subscribers.
   */
  publish(payload) {
    const subscribers = Array.from(this.#subscribers);
    for (let i = 0; i < subscribers.length; i++) {
      Promise.resolve().then(() => subscribers[i](payload));
    }
  }

  /**
   * Clear all subscribers.
   */
  clear() {
    this.#subscribers.clear();
  }
}
