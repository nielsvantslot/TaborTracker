import Saveable from "./Saveable.js";

/**
 * Represents a node in the player graph with time and player count information.
 */
export default class PlayerGraphNode extends Saveable {
  #time;
  #playerCount;

  /**
   * Constructs a new PlayerGraphNode instance.
   * @param {number} time - The time value for the node.
   * @param {number} playerCount - The player count value for the node.
   */
  constructor(time, playerCount) {
    super();
    this.#time = time;
    this.#playerCount = playerCount;
  }

  /**
   * Gets the time value of the node.
   * @returns {number} The time value.
   */
  getTime() {
    return this.#time;
  }

  /**
   * Sets the time value of the node.
   * @param {number} time - The new time value.
   */
  setTime(time) {
    this.#time = time;
  }

  /**
   * Gets the player count of the node.
   * @returns {number} The player count.
   */
  getPlayerCount() {
    return this.#playerCount;
  }

  /**
   * Sets the player count of the node.
   * @param {number} playerCount - The new player count.
   */
  setPlayerCount(playerCount) {
    this.#playerCount = playerCount;
  }

  /**
   * Saves the node data.
   * @returns {Promise<void>} A promise that resolves when the data is saved.
   */
  async save() {
    // Implement save logic here
    console.log("Saving player graph node data...");
    // Example: Save to database or file
  }

  /**
   * Serializes the node data.
   * @returns {object} The serialized data.
   */
  serialize() {
    return {
      time: this.#time,
      playerCount: this.#playerCount,
    };
  }
}
