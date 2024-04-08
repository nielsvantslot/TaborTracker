import { getCurrentTime } from "./utils.js";
import { url } from "../util/constants.js";

import axios from "axios";
import cheerio from "cheerio";

export class Scraper {
  constructor() {
    this.previousPlayersOnline = null;
  }
  async getPlayersOnline() {
    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const playersOnlineElement = $(".stat.players-online > .number");

      if (playersOnlineElement.length < 1)
        throw new Error("Unable to find the number of players online.");

      const playersOnline = parseInt(playersOnlineElement.text().trim());

      console.log(`There are currently ${playersOnline} players online.`);

      if (playersOnline === this.previousPlayersOnline) return null;
      this.previousPlayersOnline = playersOnline;

      const currentTime = await getCurrentTime();

      return {
        players: playersOnline,
        time: currentTime,
      };
    } catch (error) {
      console.error("Error fetching/scraping data: " + error.message);
    }
  }
}
