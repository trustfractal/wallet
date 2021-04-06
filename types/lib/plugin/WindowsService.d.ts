/// <reference types="chrome" />
export interface IWindowParameters {
    [key: string]: chrome.windows.CreateData;
}
