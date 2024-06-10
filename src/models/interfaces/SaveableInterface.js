export default class SaveableInterface {
  async save() {
    throw new Error("save method must be implemented");
  }

  serialize() {
    throw new Error("serialize method must be implemented");
  }
}
