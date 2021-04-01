import Subscriber from "@models/Subscriber";
import SubscribersCollection from "@models/Subscriber/SubscribersCollection";

export default class Watcher {
  constructor() {
    this.subscribers = {};
  }

  invoke({ type, payload }) {
    if (!this.subscribers[type]) return;

    this.subscribers[type].forEach((subscriber) =>
      subscriber.callback(payload),
    );
  }

  _addSubscriber(action, callback) {
    if (!this.subscribers[action]) {
      this.subscribers[action] = new SubscribersCollection();
    }

    const subscriber = new Subscriber(null, action, callback);

    this.subscribers[action].push(subscriber);

    return subscriber;
  }

  unsubscribe(action, id) {
    const registeredSubscribers = this.subscribers[action];

    registeredSubscribers.removeById(id);
  }

  subscribe(action, callback) {
    const subscriber = this._addSubscriber(action, callback);

    return {
      subscriber,
      unsubscribe: () => this.unsubscribe(action, subscriber.id),
    };
  }
}
