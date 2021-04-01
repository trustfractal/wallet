export default class Collection extends Array {
  serialize() {
    return JSON.stringify(this.map((element) => element.serialize()));
  }

  getByField(field, value) {
    return this.find((item) => item[field] === value);
  }

  filterByField(field, value) {
    return this.filter((item) => item[field] === value);
  }

  removeByField(field, value) {
    const index = this.findIndex((element) => element[field] === value);

    if (index >= 0) {
      this.splice(index, 1);
    }
  }

  getById(id) {
    return this.getByField("id", id);
  }

  removeById(id) {
    return this.removeByField("id", id);
  }

  updateItem(id, newItem) {
    for (let index = 0; index < this.length; index++) {
      const item = this[index];

      if (item.id === id) {
        this[index] = newItem;

        return;
      }
    }
  }

  indexedByField(field) {
    return this.reduce(
      (previous, current) => ({
        ...previous,
        [current[field]]: current,
      }),
      {},
    );
  }

  indexedById() {
    return this.indexedByField("id");
  }
}
