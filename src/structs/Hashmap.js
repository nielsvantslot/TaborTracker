export default class HashMap {
  constructor() {
    this.map = {};
  }

  put(key, value) {
    this.map[key] = value;
  }

  get(key) {
    return this.map[key];
  }

  contains(key) {
    return key in this.map;
  }

  remove(key) {
    if (this.contains(key)) {
      delete this.map[key];
    }
  }

  keys() {
    return Object.keys(this.map);
  }

  values() {
    return Object.values(this.map);
  }

  size() {
    return Object.keys(this.map).length;
  }

  clear() {
    this.map = {};
  }

  forEach(callback) {
    for (let key in this.map) {
      if (this.map.hasOwnProperty(key)) {
        callback(key, this.map[key]);
      }
    }
  }
}
