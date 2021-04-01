/* global chrome */

const POPUP_PARAMS = {
  focused: true,
  height: 600,
  width: 400,
  left: 0,
  top: 0,
  type: "popup",
};

class Windows {
  static getInstance() {
    if (this.instance === undefined) {
      this.instance = new Windows();
    }

    return this.instance;
  }

  createWindow(config) {
    return chrome.windows.create(config);
  }

  getCurrentWindow() {
    return chrome.windows.getCurrent();
  }

  getAllWindows() {
    return chrome.windows.getAll();
  }

  closeWindow(id) {
    return chrome.windows.remove(id);
  }

  async closeCurrentWindow() {
    const { id } = await this.getCurrentWindow();

    return this.closeWindow(id);
  }

  async closeAllWindows() {
    const windows = await this.getAllWindows();

    for (let index = 0; index < windows.length; index++) {
      const window = windows[index];

      await this.closeWindow(window);
    }
  }

  createPopup(url = "popup.html") {
    return this.createWindow({
      ...POPUP_PARAMS,
      url,
    });
  }

  async getAllPopups() {
    const windows = await this.getAllWindows();

    return windows.filter(({ type }) => type === "popup");
  }

  async closeAllPopups() {
    const popups = await this.getAllPopups();

    for (let index = 0; index < popups.length; index++) {
      const window = popups[index];

      await this.closeWindow(window);
    }
  }
}

const windows = Windows.getInstance();

export default windows;
