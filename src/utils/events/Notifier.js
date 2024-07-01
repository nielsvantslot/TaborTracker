export default class Notifier {
  constructor() {
    this.subscribers = new Set();
  }

  subscribe(subscriber) {
    if (typeof subscriber !== "function") {
      throw new Error(
        `${typeof subscriber} is not a valid argument for the subscribe method, expected a function instead`,
      );
    }
    this.subscribers.add(subscriber);
  }

  unsubscribe(subscriber) {
    if (typeof subscriber !== "function") {
      throw new Error(
        `${typeof subscriber} is not a valid argument for the unsubscribe method, expected a function instead`,
      );
    }
    this.subscribers.delete(subscriber);
  }

  publish(payload) {
    const subscribers = Array.from(this.subscribers);
    for (let i = 0; i < subscribers.length; i++) {
      Promise.resolve().then(() => subscribers[i](payload));
    }
  }

  clear() {
    this.subscribers.clear();
  }
}
