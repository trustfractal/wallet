import { ISerializable, ICollection } from "@fractalwallet/types";

export default class BaseCollection<
    T extends ISerializable & Record<string, any>
  >
  extends Array<T>
  implements ICollection<T> {
  public serialize(): string {
    return JSON.stringify(this.map((element) => element.serialize()));
  }

  public updateByField(
    field: string,
    value: any,
    updatedElem: T,
  ): T | undefined {
    for (let index = 0; index < this.length; index++) {
      const item = this[index];

      if (item[field] === value) {
        this[index] = updatedElem;

        return updatedElem;
      }
    }
  }

  public getIndexByField(field: string, value: any): number | undefined {
    for (let index = 0; index < this.length; index++) {
      const item = this[index];

      if (item[field] === value) {
        return index;
      }
    }
  }

  public getByField(field: string, value: any): T | undefined {
    return this.find((item) => item[field] === value);
  }

  public filterByField(field: string, value: any): T[] {
    return this.filter((item) => item[field] === value);
  }

  public removeByField(field: string, value: any): void {
    const index = this.findIndex((element) => element[field] === value);

    if (index >= 0) {
      this.splice(index, 1);
    }
  }
}
