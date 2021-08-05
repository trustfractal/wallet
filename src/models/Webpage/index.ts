export interface IWebpage {
  hostname: string;
  pathname: string;
  timestamp: number;
}

export default class Webpage {
  private static unixTimestamp() {
    return Math.floor(new Date().valueOf() / 1000);
  }

  public static fromString(json: string) {
    return new Webpage(JSON.parse(json));
  }

  public static fromLocation(location: Location): Webpage {
    const { hostname, pathname } = location;
    const timestamp = Webpage.unixTimestamp();

    return new Webpage({
      hostname,
      pathname,
      timestamp,
    });
  }

  public hostname: string;
  public pathname: string;
  public timestamp: number;

  public constructor({ hostname, pathname, timestamp }: IWebpage) {
    this.hostname = hostname;
    this.pathname = pathname;
    this.timestamp = timestamp;
  }

  public serialize(): string {
    return JSON.stringify(this);
  }
}
