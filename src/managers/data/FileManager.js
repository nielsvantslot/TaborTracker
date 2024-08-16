import { promises as fs } from "fs";
import path from "path";
import { __dirname } from "../../utils.js";

/**
 * Class representing a File Manager.
 */
export default class FileManager {
  /**
   * The file path where the data is stored.
   * @type {string}
   * @private
   */
  #filePath;

  /**
   * Constructs a FileManager instance.
   * @param {string} subDirectory - The subdirectory name where the file is located.
   * @param {string} fileName - The name of the file.
   */
  constructor(subDirectory, fileName) {
    const directory = path.resolve(__dirname, subDirectory);
    this.#filePath = path.resolve(directory, fileName);
  }

  /**
   * Ensures that the file exists.
   * @throws {Error} If the file does not exist.
   * @protected
   */
  async #ensureSource() {
    try {
      await fs.access(this.#filePath);
    } catch (error) {
      throw new Error(`File does not exist: ${this.#filePath}`);
    }
  }

  /**
   * Reads data from the file.
   * @returns {Object|null} - The data read from the file, or null if an error occurs.
   * @protected
   */
  async readFromFile() {
    await this.#ensureSource();
    try {
      const rawData = await fs.readFile(this.#filePath, "utf-8");
      return JSON.parse(rawData);
    } catch (error) {
      console.error("Error reading from file:", error);
      return null;
    }
  }

  /**
   * Lists files in the given subdirectories.
   * @param {Array<string>} subDirectories - The subdirectory names where the files are located.
   * @returns {Object} - An object with directory names as keys and arrays of filenames as values.
   */
  static async listFiles(subDirectories) {
    const results = {};

    for (const dir of subDirectories) {

      try {
        const fullPath = path.join(__dirname, dir);
        const files = await fs.readdir(fullPath);

        const filteredFiles = files.filter(file => file.endsWith('.ddf') || file.endsWith('.sdf'));
        results[dir] = filteredFiles;
      } catch (err) {
        console.error(`Unable to read directory ${path.join(__dirname, dir)}: ${err.message}`);
        results[dir] = null;
      }
    }

    for (const [dir, files] of Object.entries(results)) {
      if (files) {
        console.log(`Directory: ${dir}`);
        if (files.length > 0) {
          files.forEach(file => console.log(`  - ${file}`));
        } else {
          console.log("  No .ddf or .sdf files found.");
        }
        console.log(""); // Extra newline for better spacing
      } else {
        console.log(`Failed to read directory: ${dir}`);
        console.log(""); // Extra newline for better spacing
      }
    }

    process.exit(1);
  }

  /**
   * Converts JSON data to a table and logs it to the console.
   * @param {Object} json - The JSON data.
   */
  static jsonToTable(json) {
    const tableData = [];

    // Get all unique keys (columns)
    const columns = new Set();
    const columnsView = new Set();
    for (const key in json) {
      if (json.hasOwnProperty(key)) {
        const row = json[key];
        Object.keys(row).forEach(column => {
          const columnView = String(key) === String(row[column]) ? column + "*" : column;
          columnsView.add(columnView);
          columns.add(column);
        });
      }
    }

    // Convert columns to an array for ordering
    const columnsArray = Array.from(columns);
    const columnsViewArray = Array.from(columnsView);

    // Extract table rows with dynamic columns
    for (const key in json) {
      if (json.hasOwnProperty(key)) {
        const row = json[key];
        const tableRow = {};
        let i = 0;
        columnsArray.forEach(column => {
          if (isTimestamp(row[column])) {
              tableRow[columnsViewArray[i]] = timestampToDateTime(row[column]);
          } else {
              tableRow[columnsViewArray[i]] = row[column] !== undefined ? row[column] : null;
          }
          i++;
        });
        tableData.push(tableRow);
      }
    }

    // Log table to console
    console.table(tableData);
  }
}

// Helper functions for timestamp handling

// Function to check if a value is a timestamp
function isTimestamp(value) {
  if (!value || value == null) return;
    const timestampRegex = /^\d{10,13}$/; // Matches 10 to 13 digits (milliseconds timestamp)
    return timestampRegex.test(value.toString());
}

// Function to convert a timestamp to a date-time string
function timestampToDateTime(timestamp) {
    let date = new Date(parseInt(timestamp, 10));
    return date.toLocaleString(); // Adjust locale and options as needed
}
