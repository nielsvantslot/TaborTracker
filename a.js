import DynamicDataManager from "./src/managers/data/DynamicDataManager.js";

const e1 = DynamicDataManager.getInstance("test");
const e2 = DynamicDataManager.getInstance("test");
console.log(e1 === e2);
