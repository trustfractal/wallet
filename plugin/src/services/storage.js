/* global chrome */

class Storage {
  constructor() {
    this.instance = undefined;
  }

  static getInstance() {
    if (this.instance === undefined) {
      this.instance = new Storage();
    }

    return this.instance;
  }

  hasItem(key) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([key], (result) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          reject(new Error(`Storage: could not check if key '${key}' is set`));
        }

        resolve(result[key] !== undefined);
      });
    });
  }

  getItem(key, ifNull = undefined) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([key], (result) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          reject(new Error(`Storage: could not get key '${key}'`));
        }

        resolve(result[key] || ifNull);
      });
    });
  }

  setItem(key, value) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({ [key]: value }, () => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          reject(new Error(`Storage: could not set value '${value}'`));
        }

        resolve({ key, value });
      });
    });
  }

  removeItem(key) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.remove([key], () => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          reject(new Error(`Storage: could not remove key '${key}'`));
        }

        resolve(key);
      });
    });
  }

  clear() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.clear(() => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          reject(new Error("Storage: could not clear"));
        }

        resolve();
      });
    });
  }
}

const storage = Storage.getInstance();

export default storage;
