import { chrome } from "jest-chrome";

import WindowsService from "@services/WindowsService";
import {
  ERROR_CREATE_WINDOW,
  ERROR_GET_CURRENT_WINDOW,
  ERROR_GET_ALL_WINDOWS,
  ERROR_CLOSE_WINDOW,
} from "@services/WindowsService/Errors";

describe("Unit Windows Service", () => {
  describe("createWindow()", () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it("createWindow creates and returns a window", async () => {
      // Prepare
      const returnedWindow: chrome.windows.Window = {
        top: 0,
        height: 400,
        width: 600,
        state: "normal",
        focused: true,
        alwaysOnTop: false,
        incognito: false,
        type: "normal",
        id: 12,
        left: 0,
        sessionId: "11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000",
      };
      chrome.windows.create.mockImplementation(
        (_, callback?: (window?: chrome.windows.Window) => void) => {
          callback?.(returnedWindow);
        },
      );

      // Execture
      const result = await WindowsService.createWindow();

      // Assert
      const expectedResult = returnedWindow;
      expect(result).toBe(expectedResult);
      expect(chrome.windows.create).toHaveBeenCalled();
    });

    it("When a chrome error ocurrs, createWindow rejects with the error", async () => {
      // Prepare
      const returnedWindow: chrome.windows.Window = {
        top: 0,
        height: 400,
        width: 600,
        state: "normal",
        focused: true,
        alwaysOnTop: false,
        incognito: false,
        type: "normal",
        id: 12,
        left: 0,
        sessionId: "11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000",
      };
      const lastErrorMessage = "Chrome could not create window";
      const lastErrorGetter = jest.fn(() => lastErrorMessage);
      const lastError = {
        get message() {
          return lastErrorGetter();
        },
      };
      chrome.windows.create.mockImplementation(
        (_, callback?: (window?: chrome.windows.Window) => void) => {
          chrome.runtime.lastError = lastError;
          callback?.(returnedWindow);
          delete chrome.runtime.lastError;
        },
      );

      // Execute and Assert
      await expect(WindowsService.createWindow()).rejects.toThrow(
        ERROR_CREATE_WINDOW(lastError),
      );
    });
  });
  describe("getCurrentWindow()", () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it("getCurrentWindow returns the current window", async () => {
      // Prepare
      const returnedWindow: chrome.windows.Window = {
        top: 0,
        height: 400,
        width: 600,
        state: "normal",
        focused: true,
        alwaysOnTop: false,
        incognito: false,
        type: "normal",
        id: 12,
        left: 0,
        sessionId: "11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000",
      };
      chrome.windows.getCurrent.mockImplementation(
        (_, callback: (window: chrome.windows.Window) => void) => {
          callback?.(returnedWindow);
        },
      );

      // Execture
      const result = await WindowsService.getCurrentWindow();

      // Assert
      const expectedResult = returnedWindow;
      expect(result).toBe(expectedResult);
      expect(chrome.windows.getCurrent).toHaveBeenCalled();
    });

    it("When a chrome error ocurrs, getCurrentWindow rejects with the error", async () => {
      // Prepare
      const returnedWindow: chrome.windows.Window = {
        top: 0,
        height: 400,
        width: 600,
        state: "normal",
        focused: true,
        alwaysOnTop: false,
        incognito: false,
        type: "normal",
        id: 12,
        left: 0,
        sessionId: "11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000",
      };
      const lastErrorMessage = "Chrome could not get current window";
      const lastErrorGetter = jest.fn(() => lastErrorMessage);
      const lastError = {
        get message() {
          return lastErrorGetter();
        },
      };
      chrome.windows.getCurrent.mockImplementation(
        (_, callback: (window: chrome.windows.Window) => void) => {
          chrome.runtime.lastError = lastError;
          callback(returnedWindow);
          delete chrome.runtime.lastError;
        },
      );

      // Execute and Assert
      await expect(WindowsService.getCurrentWindow()).rejects.toThrow(
        ERROR_GET_CURRENT_WINDOW(lastError),
      );
    });
  });
  describe("getAllWindows()", () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it("getAllWindows returns the an array with all windows", async () => {
      // Prepare
      const returnedWindows: chrome.windows.Window[] = [
        {
          top: 0,
          height: 400,
          width: 600,
          state: "normal",
          focused: true,
          alwaysOnTop: false,
          incognito: false,
          type: "normal",
          id: 12,
          left: 0,
          sessionId: "11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000",
        },
      ];
      chrome.windows.getAll.mockImplementation(
        (_, callback: (window: chrome.windows.Window[]) => void) => {
          callback?.(returnedWindows);
        },
      );

      // Execture
      const result = await WindowsService.getAllWindows();

      // Assert
      const expectedResult = returnedWindows;
      expect(result).toBe(expectedResult);
      expect(chrome.windows.getAll).toHaveBeenCalled();
    });

    it("When a chrome error ocurrs, getCurrentWindow rejects with the error", async () => {
      // Prepare
      const returnedWindows: chrome.windows.Window[] = [
        {
          top: 0,
          height: 400,
          width: 600,
          state: "normal",
          focused: true,
          alwaysOnTop: false,
          incognito: false,
          type: "normal",
          id: 12,
          left: 0,
          sessionId: "11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000",
        },
      ];
      const lastErrorMessage = "Chrome could not get all windows";
      const lastErrorGetter = jest.fn(() => lastErrorMessage);
      const lastError = {
        get message() {
          return lastErrorGetter();
        },
      };
      chrome.windows.getAll.mockImplementation(
        (_, callback: (window: chrome.windows.Window[]) => void) => {
          chrome.runtime.lastError = lastError;
          callback(returnedWindows);
          delete chrome.runtime.lastError;
        },
      );

      // Execute and Assert
      await expect(WindowsService.getAllWindows()).rejects.toThrow(
        ERROR_GET_ALL_WINDOWS(lastError),
      );
    });
  });
  describe("closeWindow()", () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it("Given a window id, closeWindow closes the window", async () => {
      // Prepare
      const windowId = 12;
      chrome.windows.remove.mockImplementation((_, callback?: Function) => {
        callback?.();
      });

      // Execture
      await WindowsService.closeWindow(windowId);

      // Assert
      expect(chrome.windows.remove).toHaveBeenCalled();
    });

    it("When a chrome error ocurrs, closeWindow rejects with the error", async () => {
      // Prepare
      const windowId = 12;
      const lastErrorMessage = "Chrome could not close the window";
      const lastErrorGetter = jest.fn(() => lastErrorMessage);
      const lastError = {
        get message() {
          return lastErrorGetter();
        },
      };
      chrome.windows.remove.mockImplementation((_, callback?: Function) => {
        chrome.runtime.lastError = lastError;
        callback?.();
        delete chrome.runtime.lastError;
      });

      // Execute and Assert
      await expect(WindowsService.closeWindow(windowId)).rejects.toThrow(
        ERROR_CLOSE_WINDOW(lastError),
      );
    });
  });
  describe("closeCurrentWindow()", () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it("closeCurrentWindow closes the current window", async () => {
      // Prepare
      const currentWindow: chrome.windows.Window = {
        top: 0,
        height: 400,
        width: 600,
        state: "normal",
        focused: true,
        alwaysOnTop: false,
        incognito: false,
        type: "normal",
        id: 12,
        left: 0,
        sessionId: "11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000",
      };
      chrome.windows.getCurrent.mockImplementation(
        (_, callback: (window: chrome.windows.Window) => void) => {
          callback?.(currentWindow);
        },
      );
      chrome.windows.remove.mockImplementation((_, callback?: Function) => {
        callback?.();
      });

      // Execture
      await WindowsService.closeCurrentWindow();

      // Assert
      expect(chrome.windows.getCurrent).toHaveBeenCalled();
      expect(chrome.windows.remove).toHaveBeenCalled();
    });
  });
  describe("closeAllWindows()", () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it("closeAllWindows closes all windows", async () => {
      const returnedWindows: chrome.windows.Window[] = [
        {
          top: 0,
          height: 400,
          width: 600,
          state: "normal",
          focused: true,
          alwaysOnTop: false,
          incognito: false,
          type: "normal",
          id: 12,
          left: 0,
          sessionId: "11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000",
        },
      ];
      chrome.windows.getAll.mockImplementation(
        (_, callback: (window: chrome.windows.Window[]) => void) => {
          callback?.(returnedWindows);
        },
      );
      chrome.windows.remove.mockImplementation((_, callback?: Function) => {
        callback?.();
      });

      // Execture
      await WindowsService.closeAllWindows();

      // Assert
      expect(chrome.windows.getAll).toHaveBeenCalled();
      expect(chrome.windows.remove).toHaveBeenCalled();
    });
  });
  describe("createPopup()", () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it("Given an url, createPopup creates a popup window with the given url", async () => {
      const url = "popup.html";
      const returnedWindow: chrome.windows.Window = {
        top: 0,
        height: 400,
        width: 600,
        state: "normal",
        focused: true,
        alwaysOnTop: false,
        incognito: false,
        type: "normal",
        id: 12,
        left: 0,
        sessionId: "11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000",
      };
      chrome.windows.create.mockImplementation(
        (_, callback?: (window?: chrome.windows.Window) => void) => {
          callback?.(returnedWindow);
        },
      );

      // Execture
      const result = await WindowsService.createPopup(url);

      // Assert
      const expectedResult = returnedWindow;
      expect(result).toBe(expectedResult);
      expect(chrome.windows.create).toHaveBeenCalled();
    });
  });
  describe("getAllPopups()", () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it("Given an url, getAllPopups returns all popups window", async () => {
      // Prepare
      const returnedWindows: chrome.windows.Window[] = [
        {
          top: 0,
          height: 400,
          width: 600,
          state: "normal",
          focused: true,
          alwaysOnTop: false,
          incognito: false,
          type: "normal",
          id: 12,
          left: 0,
          sessionId: "11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000",
        },
      ];
      chrome.windows.getAll.mockImplementation(
        (_, callback: (window: chrome.windows.Window[]) => void) => {
          callback?.(returnedWindows);
        },
      );

      // Execture
      const result = await WindowsService.getAllWindows();

      // Assert
      const expectedResult = returnedWindows;
      expect(result).toBe(expectedResult);
      expect(chrome.windows.getAll).toHaveBeenCalled();
    });
  });
  describe("closeAllPopups()", () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    it("Given an url, closeAllPopups closes all popups window", async () => {
      // Prepare
      const returnedWindows: chrome.windows.Window[] = [
        {
          top: 0,
          height: 400,
          width: 600,
          state: "normal",
          focused: true,
          alwaysOnTop: false,
          incognito: false,
          type: "normal",
          id: 12,
          left: 0,
          sessionId: "11bf5b37-e0b8-42e0-8dcf-dc8c4aefc000",
        },
      ];
      chrome.windows.getAll.mockImplementation(
        (_, callback: (window: chrome.windows.Window[]) => void) => {
          callback?.(returnedWindows);
        },
      );
      chrome.windows.remove.mockImplementation((_, callback?: Function) => {
        callback?.();
      });

      // Execture
      await WindowsService.closeAllPopups();

      // Assert
      expect(chrome.windows.getAll).toHaveBeenCalled();
      expect(chrome.windows.remove).toHaveBeenCalled();
    });
  });
});
