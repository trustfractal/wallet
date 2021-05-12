import { IRequester } from "@pluginTypes/index";

export default class Requester implements IRequester {
  public name: string;
  public url: string;
  public icon: string;
  constructor(name: string, url: string, icon: string) {
    this.name = name;
    this.url = url;
    this.icon = icon;
  }

  public serialize(): string {
    return JSON.stringify({
      name: this.name,
      url: this.url,
      icon: this.icon,
    });
  }

  public static parse(str: string): Requester {
    const { name, url, icon } = JSON.parse(str);

    return new Requester(name, url, icon);
  }
}
