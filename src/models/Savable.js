// Saveable.js
export default class Saveable {
  async save() {
    throw new Error("save method must be implemented");
  }

  serialize() {
    throw new Error("serialize method must be implemented");
  }

  withSave(operation) {
    return async (...args) => {
      const result = await operation.apply(this, args);
      await this.save();
      return result;
    };
  }
}
