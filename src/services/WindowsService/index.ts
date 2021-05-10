import {
  ERROR_CREATE_WINDOW,
  ERROR_CREATE_TAB,
  ERROR_GET_CURRENT_WINDOW,
  ERROR_GET_WINDOW,
  ERROR_GET_ALL_WINDOWS,
  ERROR_FOCUS_WINDOW,
  ERROR_GET_LAST_FOCUSED_WINDOW,
  ERROR_UPDATE_WINDOW_POSITION,
  ERROR_CLOSE_WINDOW,
  ERROR_GET_TAB,
  ERROR_UPDATE_TAB,
  ERROR_QUERY_TABS,
} from "./Errors";

import environment from "@environment/index";

const POPUP_WIDTH = 400;
const POPUP_HEIGHT = 460;

class WindowsService {
  private static instance: WindowsService;
  private popupId?: number;

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

  getLastFocusedWindow(): Promise<chrome.windows.Window> {
    return new Promise((resolve, reject) => {
      chrome.windows.getLastFocused((window) => {
        if (chrome.runtime.lastError !== undefined) {
          console.error(chrome.runtime.lastError);
          reject(ERROR_GET_LAST_FOCUSED_WINDOW(chrome.runtime.lastError));
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

  focusWindow(windowId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.windows.update(windowId, { focused: true }, () => {
        if (chrome.runtime.lastError !== undefined) {
          console.error(chrome.runtime.lastError);
          reject(ERROR_FOCUS_WINDOW(chrome.runtime.lastError));
        }

        resolve();
      });
    });
  }

  updateWindowPosition(
    windowId: number,
    left: number,
    top: number,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.windows.update(windowId, { left, top }, () => {
        if (chrome.runtime.lastError !== undefined) {
          console.error(chrome.runtime.lastError);
          reject(ERROR_UPDATE_WINDOW_POSITION(chrome.runtime.lastError));
        }

        resolve();
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

  async createPopup(): Promise<chrome.windows.Window | undefined> {
    const popup = await this.getPopup();

    if (popup) {
      // bring focus to existing chrome popup
      await this.focusWindow(popup.id);
      return;
    }

    let left = 0;
    let top = 0;

    const lastFocused = await this.getLastFocusedWindow();
    if (lastFocused.top === undefined) {
      const { screenY } = window;

      top = Math.max(screenY, 0);
    } else {
      top = lastFocused.top;
    }

    if (lastFocused.left === undefined || lastFocused.width === undefined) {
      const { screenX, outerWidth } = window;
      left = Math.max(screenX + (outerWidth - POPUP_WIDTH), 0);
    } else {
      left = lastFocused.left + (lastFocused.width - POPUP_WIDTH);
    }

    // create new notification popup
    const popupWindow = await this.createWindow({
      url: "popup.html",
      type: "popup",
      width: POPUP_WIDTH,
      height: POPUP_HEIGHT,
      left,
      top,
    });

    if (popupWindow !== undefined) {
      if (popupWindow.left !== left && popupWindow.state !== "fullscreen") {
        await this.updateWindowPosition(popupWindow.id, left, top);
      }

      this.popupId = popupWindow.id;
    }

    return popupWindow;
  }

  private async getPopup() {
    const windows = await this.getAllWindows();

    if (windows === undefined || windows.length === 0) {
      return;
    }

    return windows.find(
      (win) => win && win.type === "popup" && win.id === this.popupId,
    );
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

  createTab(
    properties: chrome.tabs.CreateProperties,
  ): Promise<chrome.tabs.Tab> {
    return new Promise((resolve, reject) => {
      chrome.tabs.create(properties, (tab) => {
        if (chrome.runtime.lastError !== undefined) {
          console.error(chrome.runtime.lastError);
          reject(ERROR_CREATE_TAB(chrome.runtime.lastError));
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

  async getActiveTabs(): Promise<chrome.tabs.Tab[]> {
    return new Promise<chrome.tabs.Tab[]>((resolve) => {
      // get last normal window focused
      chrome.windows.getLastFocused(
        {
          // @ts-ignore
          windowTypes: ["normal"],
        },
        async (lastWindowFocused) => {
          // get window active tab
          const tabs = await this.queryTabs({
            windowId: lastWindowFocused.id,
            active: true,
          });

          resolve(tabs);
        },
      );
    });
  }

  async getFractalTabs(): Promise<chrome.tabs.Tab[]> {
    const { hostname } = new URL(environment.FRACTAL_WEBSITE_URL);

    const senderHostname = hostname.startsWith("www.")
      ? hostname.substr(4)
      : hostname;

    // get fractal tab
    const tabs = await this.queryTabs({
      url: `*://*.${senderHostname}/*`,
    });

    return tabs;
  }

  async openTab(url: string) {
    const activeTabs = await this.getActiveTabs();

    if (activeTabs.length === 0) {
      return this.createTab({ url });
    }

    const [activeTab] = activeTabs;

    if (activeTab.id === undefined) {
      return this.createTab({ url });
    }

    return this.redirectTab(activeTab.id, url);
  }
}

const windows: WindowsService = WindowsService.getInstance();

export default windows;
