import SaveableInterface from "../interfaces/SaveableInterface.js";

export default class Saveable extends SaveableInterface {
  withSave(operation) {
    return async (...args) => {
      const result = await operation.apply(this, args);
      await this.save();
      return result;
    };
  }
}
