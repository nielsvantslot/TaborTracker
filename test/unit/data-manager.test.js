import { promises as fs, readdir } from "fs";
import DataManager from "../../src/managers/data/DataManager.js";
import { __dirname } from "../../src/utils.js";

describe("DataManager", () => {
  // Define the variables to hold the file paths
  let subDirectory;
  let fileName;
  let filePath;
  let directoryPath;

  // Before each test, set up the file paths
  beforeEach(() => {
    subDirectory = "test";
    fileName = "tempFile.json";
    directoryPath = `${__dirname}/data/${subDirectory}`;
    filePath = `${directoryPath}/${fileName}`;
  });

  // After each test, delete the test file if it exists
  afterEach(async () => {
    try {
      await fs.unlink(filePath);
    } catch (err) {
      // File doesn't exist, do nothing
    }
    DataManager.resetInstances();
  });

  // After all tests, remove the test directory if it exists and is empty
  afterAll(async () => {
    try {
      await fs.rmdir(directoryPath);
    } catch (err) {
      // Directory doesn't exist or not empty, do nothing
    }
  });

  describe("instances", () => {
    it("should be able to get it's own instance", async () => {
      const inst1 = DataManager.getInstance(subDirectory, fileName);
      const inst2 = DataManager.getInstance(subDirectory, fileName);
      await expect(inst1).toBe(inst2);
    });

    it("should be able to reset instances", async () => {
      const inst1 = DataManager.getInstance(subDirectory, fileName);
      DataManager.resetInstances();
      const inst2 = DataManager.getInstance(subDirectory, fileName);
      await expect(inst1).not.toBe(inst2);
    });
  });

  describe("initializeFile", () => {
    it("should create the file if it doesn't exist", async () => {
      const dataManager = DataManager.getInstance(subDirectory, fileName);
      await dataManager._ensureSource();
      const fileExists = await fs
        .access(filePath)
        .then(() => true)
        .catch(() => false);
      expect(fileExists).toBe(true);
    });
  });

  describe("readFromFile", () => {
    it("should read data from the file", async () => {
      const data = { key: "value" };
      await fs.writeFile(filePath, JSON.stringify(data));
      const dataManager = DataManager.getInstance(subDirectory, fileName);
      const readData = await dataManager._readFromFile();
      expect(readData).toEqual(data);
    });

    it("should return null if an error occurs during reading", async () => {
      // Set up the mock to throw an error when fs.readFile is called
      const dataManager = DataManager.getInstance(subDirectory, fileName);
      await dataManager._ensureSource();
      await fs.unlink(filePath);
      const readData = await dataManager._readFromFile();

      // Verify that readFromFile returns null
      expect(readData).toBeNull();
    });

    it("should return null when reading from an empty file", async () => {
      // Create an empty file
      await fs.writeFile(filePath, "");

      // Initialize DataManager and read data from the empty file
      const dataManager = DataManager.getInstance(subDirectory, fileName);
      const readData = await dataManager._readFromFile();

      // Verify that readFromFile returns null for empty file
      expect(readData).toBeNull();
    });

    it("should handle invalid JSON data and return null", async () => {
      // Write invalid JSON data to the file
      await fs.writeFile(filePath, "invalid JSON");

      // Initialize DataManager and attempt to read data from the file
      const dataManager = DataManager.getInstance(subDirectory, fileName);
      const readData = await dataManager._readFromFile();

      // Verify that readFromFile returns null for invalid JSON data
      expect(readData).toBeNull();
    });
  });
});
