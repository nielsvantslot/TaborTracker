import { graphLength } from "../../../util/constants.js";
import { PlayerGraph } from "../../models/graphs/PlayerGraph.js";
import PlayerGraphNode from "../../models/graphs/PlayerGraphNode.js";
import DynamicDataManager from "../data/DynamicDataManager.js";
import PlayerGraphDisplay from "./PlayerGraphDisplayManager.js";

export default class PlayerGraphManger {
  #dataManager;

  static #instance;

  constructor() {
    if (PlayerGraphManger.#instance) {
      throw new Error("DONT use this constructor, try getInstance()");
    }
    PlayerGraphManger.#instance = this;
    this.#dataManager = DynamicDataManager.getInstance("playerGraph");
  }

  static getInstance() {
    return (
      PlayerGraphManger.#instance ??
      (PlayerGraphManger.#instance = new PlayerGraphManger())
    );
  }

  async generateAndDisplayGraph() {
    const graph = await this.#generateGraph();
    const playerCount = await this.#getCurrentPlayerCount();
    if (!graph || !playerCount) return;
    const view = new PlayerGraphDisplay(graph, playerCount);
    await view.displayGraph();
  }

  async #generateGraph() {
    const arrayData = await this.getAsArrays();
    const graph = new PlayerGraph(arrayData.times, arrayData.playerCounts);
    return graph.draw();
  }

  async #getCurrentPlayerCount() {
    const nodes = await this.getAll();
    const keys = Object.keys(nodes);
    const length = keys.length;

    if (length == 0) return null;

    const lastKey = keys[length - 1];

    return nodes[lastKey].playerCount;
  }

  createNode(time, playerCount) {
    new PlayerGraphNode(time, playerCount);
  }

  async getAll() {
    return await this.#dataManager.readAllRecords();
  }

  async getAsArrays() {
    const data = await this.getAll();
    const dataArray = Object.values(data);
    const filteredData = dataArray.filter((node) => node.playerCount !== null);

    const timestamps = filteredData.map((node) => node.time);
    const playerCounts = filteredData.map((node) => node.playerCount);
    return {
      times: timestamps,
      playerCounts: playerCounts,
    };
  }

  async addData(id, node) {
    const nodes = await this.getAll();
    if (nodes) {
      const keys = Object.keys(nodes);
      if (keys.length >= graphLength) {
        const itemsToRemove = keys.length - (graphLength - 1);
        for (let i = 0; i < itemsToRemove; i++) {
          await this.delete(nodes[keys[i]].time);
        }
      }
      if (
        keys.length > 0 &&
        nodes[keys[keys.length - 1]].playerCount == node.getPlayerCount()
      )
        return;
    }
    await this.#dataManager.createRecord(id, node.serialize());
  }

  async delete(id) {
    await this.#dataManager.deleteRecord(id);
  }
}
