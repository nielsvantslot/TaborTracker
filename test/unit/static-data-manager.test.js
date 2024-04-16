import StaticDataManager from "../../src/managers/data/StaticDataManager.js";
import { promises as fs } from "fs";
import { __dirname } from "../../src/utils.js";

describe("StaticDataManager", () => {
  // Define the variables to hold the file paths
  let fileName;
  let filePath;

  // Before each test, set up the file paths
  beforeEach(() => {
    fileName = "staticTestFile";
    filePath = `${__dirname}/data/static/${fileName}.sdf`;
  });

  // After each test, delete the test file if it exists
  afterEach(async () => {
    try {
      await fs.unlink(filePath);
    } catch (err) {
      // File doesn't exist, do nothing
    }
    StaticDataManager.resetInstances();
  });

  describe("instances", () => {
    it("should be able to get it's own instance", async () => {
      const inst1 = StaticDataManager.getInstance(fileName);
      const inst2 = StaticDataManager.getInstance(fileName);
      await expect(inst1).toBe(inst2);
    });

    it("should be able to reset instances", async () => {
      const inst1 = StaticDataManager.getInstance(fileName);
      StaticDataManager.resetInstances();
      const inst2 = StaticDataManager.getInstance(fileName);
      await expect(inst1).not.toBe(inst2);
    });
  });

  describe("constructor", () => {
    it("should initialize the StaticDataManager instance", async () => {
      const dataManager = StaticDataManager.getInstance(fileName);
      await expect(dataManager).toBeInstanceOf(StaticDataManager);
    });
  });

  describe("getData", () => {
    it("should return the data from the file", async () => {
      const testData = { key: "value" };
      await fs.writeFile(filePath, JSON.stringify(testData));

      const dataManager = StaticDataManager.getInstance(fileName);

      const retrievedData = await dataManager.getData();

      expect(retrievedData).toEqual(testData);
    });
  });
});
