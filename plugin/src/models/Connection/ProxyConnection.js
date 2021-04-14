import Invokation from "@models/Message/Invokation";

export default class ProxyConnection {
  constructor(inpage, background) {
    this.inpage = inpage;
    this.background = background;
  }

  // forwards messages to the inpage script
  forwardInpage(invokation) {
    this.postInpageMessage(Invokation.NAME, invokation.serialize());
  }

  // post a message to the inpage script via stream
  postInpageMessage(type, message) {
    this.inpage.postMessage(type, message);
  }

  // forwards messages to the background script
  forwardBackground(invokation) {
    this.postBackgroundMessage(Invokation.NAME, invokation.serialize());
  }

  // post a message to the background script via chrome ports
  postBackgroundMessage(type, message) {
    this.background.postMessage(type, message);
  }

  // proxy messages froms inpage to background
  proxy(method) {
    this.inpage.on(method, (...args) => {
      return new Promise((resolve, reject) => {
        const invokation = new Invokation(method, args);

        // TODO: Remove debug console.log
        console.log("proxy: inpage -> background", invokation);

        // forward message to background
        this.forwardBackground(invokation);

        // listen for background reply
        this.background
          .listen(invokation.id)
          .then((value) => resolve(value))
          .catch((error) => reject(error));
      });
    });

    return this;
  }

  // proxy messages froms background to inpage
  reversedProxy(method) {
    this.background.on(method, (...args) => {
      return new Promise((resolve, reject) => {
        const invokation = new Invokation(method, args);

        // TODO: Remove debug console.log
        console.log("proxy: background -> inpage", invokation);

        // forward message to inpage
        this.forwardInpage(invokation);

        // listen for inpage reply
        this.inpage
          .listen(invokation.id)
          .then((value) => resolve(value))
          .catch((error) => reject(error));
      });
    });

    return this;
  }
}
