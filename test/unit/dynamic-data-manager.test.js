import DynamicDataManager, {
  extension,
} from "../../src/managers/data/DynamicDataManager.js";
import { promises as fs } from "fs";
import { __dirname } from "../../src/utils.js";

describe("DynamicDataManager", () => {
  // Define the variables to hold the file paths
  let fileName;
  let filePath;

  // Before each test, set up the file paths
  beforeEach(() => {
    fileName = "dynamicTestFile";
    filePath = `${__dirname}/data/dynamic/${fileName + extension}`;
  });

  // After each test, delete the test file if it exists
  afterEach(async () => {
    try {
      await fs.unlink(filePath);
    } catch (err) {
      // File doesn't exist, do nothing
    }
    DynamicDataManager.resetInstances();
  });

  describe("instances", () => {
    it("should be able to get it's own instance", async () => {
      const inst1 = DynamicDataManager.getInstance(fileName);
      const inst2 = DynamicDataManager.getInstance(fileName);
      await expect(inst1).toBe(inst2);
    });

    it("should be able to reset instances", async () => {
      const inst1 = DynamicDataManager.getInstance(fileName);
      DynamicDataManager.resetInstances();
      const inst2 = DynamicDataManager.getInstance(fileName);
      await expect(inst1).not.toBe(inst2);
    });
  });

  describe("createRecord", () => {
    it("should create a new record in the file", async () => {
      const testData = { key: "value" };
      const dataManager = DynamicDataManager.getInstance(fileName);

      await dataManager.createRecord("newKey", testData);
      const fileContent = await fs.readFile(filePath, "utf-8");
      const parsedData = JSON.parse(fileContent);

      expect(parsedData.newKey).toEqual(testData);
    });
  });

  describe("readRecord", () => {
    it("should read a record from the file", async () => {
      const testData = { key: "value" };
      await fs.writeFile(filePath, JSON.stringify({ existingKey: testData }));

      const dataManager = DynamicDataManager.getInstance(fileName);
      const retrievedData = await dataManager.readRecord("existingKey");

      expect(retrievedData).toEqual(testData);
    });

    it("should return null if the record does not exist", async () => {
      const dataManager = DynamicDataManager.getInstance(fileName);
      const retrievedData = await dataManager.readRecord("nonExistingKey");

      expect(retrievedData).toBeNull();
    });
  });

  describe("updateRecord", () => {
    it("should update a record in the file", async () => {
      const testData = { existingKey: "value" };
      await fs.writeFile(filePath, JSON.stringify(testData));

      const dataManager = DynamicDataManager.getInstance(fileName);
      await dataManager.updateRecord("existingKey", "updatedValue");
      const fileContent = await fs.readFile(filePath, "utf-8");
      const parsedData = JSON.parse(fileContent);

      expect(parsedData.existingKey).toEqual("updatedValue");
    });

    it("should throw an error if the record does not exist", async () => {
      const dataManager = DynamicDataManager.getInstance(fileName);

      await expect(
        dataManager.updateRecord("nonExistingKey", "value"),
      ).rejects.toThrow("Record with key nonExistingKey not found.");
    });
  });

  describe("deleteRecord", () => {
    it("should delete a record from the file", async () => {
      const testData = { existingKey: "value" };
      await fs.writeFile(filePath, JSON.stringify(testData));

      const dataManager = DynamicDataManager.getInstance(fileName);
      await dataManager.deleteRecord("existingKey");
      const fileContent = await fs.readFile(filePath, "utf-8");
      const parsedData = JSON.parse(fileContent);

      expect(parsedData).toEqual({});
    });

    it("should throw an error if the record does not exist", async () => {
      const dataManager = DynamicDataManager.getInstance(fileName);

      await expect(dataManager.deleteRecord("nonExistingKey")).rejects.toThrow(
        "Record with key nonExistingKey not found.",
      );
    });
  });
});
