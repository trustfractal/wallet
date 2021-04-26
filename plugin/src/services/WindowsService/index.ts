import { POPUP } from "./Params";
import {
  ERROR_CREATE_WINDOW,
  ERROR_GET_CURRENT_WINDOW,
  ERROR_GET_WINDOW,
  ERROR_GET_ALL_WINDOWS,
  ERROR_CLOSE_WINDOW,
  ERROR_GET_TAB,
  ERROR_UPDATE_TAB,
  ERROR_QUERY_TABS,
} from "./Errors";

class WindowsService {
  private static instance: WindowsService;

  private constructor() {}

  public static getInstance(): WindowsService {
    if (!WindowsService.instance) {
      WindowsService.instance = new WindowsService();
    }

    return WindowsService.instance;
  }

  createWindow(
    config: chrome.windows.CreateData = {},
  ): Promise<chrome.windows.Window | undefined> {
    return new Promise((resolve, reject) => {
      chrome.windows.create(config, (window) => {
        if (chrome.runtime.lastError !== undefined) {
          console.error(chrome.runtime.lastError);
          reject(ERROR_CREATE_WINDOW(chrome.runtime.lastError));
        }

        resolve(window);
      });
    });
  }

  getCurrentWindow(
    config: chrome.windows.GetInfo = {},
  ): Promise<chrome.windows.Window> {
    return new Promise((resolve, reject) => {
      chrome.windows.getCurrent(config, (window) => {
        if (chrome.runtime.lastError !== undefined) {
          console.error(chrome.runtime.lastError);
          reject(ERROR_GET_CURRENT_WINDOW(chrome.runtime.lastError));
        }

        resolve(window);
      });
    });
  }

  getAllWindows(
    config: chrome.windows.GetInfo = {},
  ): Promise<Array<chrome.windows.Window>> {
    return new Promise((resolve, reject) => {
      chrome.windows.getAll(config, (windows) => {
        if (chrome.runtime.lastError !== undefined) {
          console.error(chrome.runtime.lastError);
          reject(ERROR_GET_ALL_WINDOWS(chrome.runtime.lastError));
        }

        resolve(windows);
      });
    });
  }

  closeWindow(windowId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.windows.remove(windowId, () => {
        if (chrome.runtime.lastError !== undefined) {
          console.error(chrome.runtime.lastError);
          reject(ERROR_CLOSE_WINDOW(chrome.runtime.lastError));
        }

        resolve();
      });
    });
  }

  async closeCurrentWindow(): Promise<chrome.windows.Window> {
    const window = await this.getCurrentWindow();

    await this.closeWindow(window.id);

    return window;
  }

  async closeAllWindows(): Promise<Array<chrome.windows.Window>> {
    const windows = await this.getAllWindows();

    for (let index = 0; index < windows.length; index++) {
      const { id } = windows[index];

      await this.closeWindow(id);
    }

    return windows;
  }

  createPopup(
    url: string = "popup.html",
  ): Promise<chrome.windows.Window | undefined> {
    return this.createWindow({
      ...POPUP,
      url,
    });
  }

  async getAllPopups(): Promise<Array<chrome.windows.Window>> {
    return this.getAllWindows({
      windowTypes: ["popup"],
    });
  }

  async closeAllPopups(): Promise<Array<chrome.windows.Window>> {
    const popups = await this.getAllPopups();

    for (let index = 0; index < popups.length; index++) {
      const window = popups[index];

      await this.closeWindow(window.id);
    }

    return popups;
  }

  getWindow(
    windowId: number,
    config: chrome.windows.GetInfo = {},
  ): Promise<chrome.windows.Window> {
    return new Promise((resolve, reject) => {
      chrome.windows.get(windowId, config, (window) => {
        if (chrome.runtime.lastError !== undefined) {
          console.error(chrome.runtime.lastError);
          reject(ERROR_GET_WINDOW(chrome.runtime.lastError, windowId));
        }

        resolve(window);
      });
    });
  }

  getTab(tabId: number): Promise<chrome.tabs.Tab> {
    return new Promise((resolve, reject) => {
      chrome.tabs.get(tabId, (tab) => {
        if (chrome.runtime.lastError !== undefined) {
          console.error(chrome.runtime.lastError);
          reject(ERROR_GET_TAB(chrome.runtime.lastError, tabId));
        }

        resolve(tab);
      });
    });
  }

  updateTab(
    tabId: number,
    config: chrome.tabs.UpdateProperties,
  ): Promise<chrome.tabs.Tab | undefined> {
    return new Promise((resolve, reject) => {
      chrome.tabs.update(tabId, config, (updatedtab) => {
        if (chrome.runtime.lastError !== undefined) {
          console.error(chrome.runtime.lastError);
          reject(ERROR_UPDATE_TAB(chrome.runtime.lastError, tabId));
        }

        resolve(updatedtab);
      });
    });
  }

  queryTabs(queryInfo: chrome.tabs.QueryInfo = {}): Promise<chrome.tabs.Tab[]> {
    return new Promise((resolve, reject) => {
      chrome.tabs.query(queryInfo, (tabs) => {
        if (chrome.runtime.lastError !== undefined) {
          console.error(chrome.runtime.lastError);
          reject(ERROR_QUERY_TABS(chrome.runtime.lastError));
        }

        resolve(tabs);
      });
    });
  }

  redirectTab(id: number, url: string) {
    return this.updateTab(id, { url });
  }

  async getActiveTab(): Promise<chrome.tabs.Tab | undefined> {
    const tabs = await this.queryTabs({
      active: true,
      lastFocusedWindow: true,
    });

    if (tabs.length === 0) {
      return;
    }

    return tabs[0];
  }
}

const windows: WindowsService = WindowsService.getInstance();

export default windows;
