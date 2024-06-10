import axios from "axios";
import cheerio from "cheerio";
import { getCurrentTime } from "../../utils.js";
import { url } from "../../../util/constants.js";

export class PlayerCountScraper {
  constructor() {
    this.previousPlayersOnline = null;
  }

  async fetchPageContent() {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching data: " + error.message);
      throw new Error("Failed to fetch page content.");
    }
  }

  parsePlayersOnline(html) {
    const $ = cheerio.load(html);
    const playersOnlineElement = $(".stat.players-online > .number");

    if (playersOnlineElement.length < 1) {
      throw new Error("Unable to find the number of players online.");
    }

    const parsedValue = parseInt(playersOnlineElement.text().trim(), 10);
    return isNaN(parsedValue) ? 0 : parsedValue;
  }

  async getPlayersOnline() {
    try {
      const html = await this.fetchPageContent();
      const playersOnline = this.parsePlayersOnline(html);

      if (playersOnline === this.previousPlayersOnline) {
        return null;
      }

      this.previousPlayersOnline = playersOnline;
      const currentTime = await getCurrentTime();

      return {
        playerCount: playersOnline,
        time: currentTime,
      };
    } catch (error) {
      console.error("Error processing data: " + error.message);
      return null;
    }
  }
}
