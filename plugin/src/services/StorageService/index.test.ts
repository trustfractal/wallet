import { chrome } from "jest-chrome";

import StorageService from "@services/StorageService";
import {
  ERROR_HAS_ITEM,
  ERROR_GET_ITEM,
  ERROR_SET_ITEM,
  ERROR_REMOVE_ITEM,
  ERROR_CLEAR,
} from "@services/StorageService/Errors";

describe("Storage Service", () => {
  describe("hasItem()", () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it("Given an existing key for a stored value, hasItem returns true", async () => {
      // Prepare
      const key = "key";
      const value = "value";
      chrome.storage.local.get.mockImplementation(
        (_, callback: (items: { [key: string]: any }) => void) => {
          callback({ [key]: value });
        },
      );

      // Execture
      const result = await StorageService.hasItem(key);

      // Assert
      const expectedResult = true;
      expect(result).toBe(expectedResult);
      expect(chrome.storage.local.get).toHaveBeenCalled();
    });

    it("Given an unexisting key, hasItem returns false", async () => {
      // Prepare
      const key = "key";
      chrome.storage.local.get.mockImplementation(
        (_, callback: (items: { [key: string]: any }) => void) => {
          callback({});
        },
      );

      // Execute
      const result = await StorageService.hasItem(key);

      // Assert
      const expectedResult = false;
      expect(result).toBe(expectedResult);
      expect(chrome.storage.local.get).toHaveBeenCalled();
    });

    it("When a chrome error ocurrs, hasItem rejects with the error", async () => {
      // Prepare
      const key = "key";
      const lastErrorMessage = "Chrome could not get the item";
      const lastErrorGetter = jest.fn(() => lastErrorMessage);
      const lastError = {
        get message() {
          return lastErrorGetter();
        },
      };
      chrome.storage.local.get.mockImplementation(
        (_, callback: (items: { [key: string]: any }) => void) => {
          chrome.runtime.lastError = lastError;
          callback({});
          delete chrome.runtime.lastError;
        },
      );

      // Execute and Assert
      await expect(StorageService.hasItem(key)).rejects.toThrow(
        ERROR_HAS_ITEM(lastError, key),
      );
    });
  });
  describe("getItem()", () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it("Given an existing key for a stored value, getItem returns the stored value", async () => {
      // Prepare
      const key = "key";
      const value = "value";
      chrome.storage.local.get.mockImplementation(
        (_, callback: (items: { [key: string]: any }) => void) => {
          callback({
            [key]: value,
          });
        },
      );

      // Execute
      const result = await StorageService.getItem(key);

      // Assert
      const expectedResult = value;
      expect(result).toBe(expectedResult);
      expect(chrome.storage.local.get).toHaveBeenCalled();
    });

    it("Given an unexisting key, getItem returns undefined", async () => {
      // Prepare
      const key = "key";
      chrome.storage.local.get.mockImplementation(
        (_, callback: (items: { [key: string]: any }) => void) => {
          callback({});
        },
      );

      // Execute
      const result = await StorageService.getItem(key);

      // Assert
      const expectedResult = undefined;
      expect(result).toBe(expectedResult);
      expect(chrome.storage.local.get).toHaveBeenCalled();
    });

    it("Given an unexisting key and a default value, getItem returns the default value", async () => {
      // Prepare
      const key = "key";
      const defaultValue = "default_value";
      chrome.storage.local.get.mockImplementation(
        (_, callback: (items: { [key: string]: any }) => void) => {
          callback({});
        },
      );

      // Execute
      const result = await StorageService.getItem(key, defaultValue);

      // Assert
      const expectedResult = defaultValue;
      expect(result).toBe(expectedResult);
      expect(chrome.storage.local.get).toHaveBeenCalled();
    });

    it("When a chrome error ocurrs, getItem rejects with the error", async () => {
      // Prepare
      const key = "key";
      const lastErrorMessage = "Chrome could not get the item";
      const lastErrorGetter = jest.fn(() => lastErrorMessage);
      const lastError = {
        get message() {
          return lastErrorGetter();
        },
      };
      chrome.storage.local.get.mockImplementation(
        (_, callback: (items: { [key: string]: any }) => void) => {
          chrome.runtime.lastError = lastError;
          callback({});
          delete chrome.runtime.lastError;
        },
      );

      // Execute and Assert
      await expect(StorageService.getItem(key)).rejects.toThrow(
        ERROR_GET_ITEM(lastError, key),
      );
    });
  });
  describe("setItem()", () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it("Given a key and a value, setItem stores the value", async () => {
      // Prepare
      const key = "key";
      const value = "value";
      chrome.storage.local.set.mockImplementation(
        (items: Object, callback?: () => void) => {
          callback?.();
        },
      );

      // Execute
      await StorageService.setItem(key, value);

      // Assert
      expect(chrome.storage.local.set).toHaveBeenCalled();
    });

    it("When a chrome error ocurrs, setItem rejects with the error", async () => {
      // Prepare
      const key = "key";
      const value = "value";
      const lastErrorMessage = "Chrome could not set the item";
      const lastErrorGetter = jest.fn(() => lastErrorMessage);
      const lastError = {
        get message() {
          return lastErrorGetter();
        },
      };
      chrome.storage.local.set.mockImplementation(
        (items: Object, callback?: () => void) => {
          chrome.runtime.lastError = lastError;
          callback?.();
          delete chrome.runtime.lastError;
        },
      );

      // Execute and Assert
      await expect(StorageService.setItem(key, value)).rejects.toThrow(
        ERROR_SET_ITEM(lastError, key, value),
      );
    });
  });
  describe("removeItem()", () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it("Given an existing key, removeItem deletes the value", async () => {
      // Prepare
      const key = "key";
      chrome.storage.local.remove.mockImplementation(
        (keys: string | string[], callback?: () => void) => {
          callback?.();
        },
      );

      // Execute
      await StorageService.removeItem(key);

      // Assert
      expect(chrome.storage.local.remove).toHaveBeenCalled();
    });

    it("When a chrome error ocurrs, removeItem rejects with the error", async () => {
      // Prepare
      const key = "key";
      const lastErrorMessage = "Chrome could not remove the item";
      const lastErrorGetter = jest.fn(() => lastErrorMessage);
      const lastError = {
        get message() {
          return lastErrorGetter();
        },
      };
      chrome.storage.local.remove.mockImplementation(
        (keys: string | string[], callback?: () => void) => {
          chrome.runtime.lastError = lastError;
          callback?.();
          delete chrome.runtime.lastError;
        },
      );

      // Execute and Assert
      await expect(StorageService.removeItem(key)).rejects.toThrow(
        ERROR_REMOVE_ITEM(lastError, key),
      );
    });
  });
  describe("clearStorage()", () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it("For an not empty storage, clearStorage should delete all items", async () => {
      // Prepare
      chrome.storage.local.clear.mockImplementation((callback?: () => void) => {
        callback?.();
      });

      // Execute
      await StorageService.clear();

      // Assert
      expect(chrome.storage.local.clear).toHaveBeenCalled();
    });
    it("When a chrome error ocurrs, clear rejects with the error", async () => {
      // Prepare
      const lastErrorMessage = "Chrome could not clear";
      const lastErrorGetter = jest.fn(() => lastErrorMessage);
      const lastError = {
        get message() {
          return lastErrorGetter();
        },
      };
      chrome.storage.local.clear.mockImplementation((callback?: () => void) => {
        chrome.runtime.lastError = lastError;
        callback?.();
        delete chrome.runtime.lastError;
      });

      // Execute and Assert
      await expect(StorageService.clear()).rejects.toThrow(
        ERROR_CLEAR(lastError),
      );
    });
  });
});
