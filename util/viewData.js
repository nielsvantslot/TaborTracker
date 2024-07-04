import fs from 'fs';
import path from 'path';
import { __dirname } from '../src/utils.js'; // Assuming this is correctly defined in your utils.js

function jsonToTable(json) {
  const tableData = [];

  // Get all unique keys (columns)
  const columns = new Set();
  const columnsView = new Set();
  for (const key in json) {
      if (json.hasOwnProperty(key)) {
        const row = json[key];
        Object.keys(row).forEach(column => {
          const columnView = key == row[column] ? column + "*" : column;
          columnsView.add(columnView);
          columns.add(column)
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
        tableRow[columnsViewArray[i]] = row[column] !== undefined ? row[column] : null;
        i++;
      });
      tableData.push(tableRow);
    }
  }

  // Log table to console
  console.table(tableData);
}

// Get the filename from command line arguments
const args = process.argv.slice(2);
const filename = args[0];

if (!filename) {
  console.error('Please provide a filename as an argument.');
  process.exit(1);
}

// Determine the correct folder based on the file extension
const fileExtension = path.extname(filename);
let folder;

if (fileExtension === '.ddf') {
  folder = 'data/dynamic';
} else if (fileExtension === '.sdf') {
  folder = 'data/static';
} else {
  console.error('Unsupported file extension. Please use .ddf or .sdf.');
  process.exit(1);
}

// Read the file
const filepath = path.resolve(__dirname, folder, filename);
fs.readFile(filepath, 'utf8', (err, data) => {
  if (err) {
    console.error(`Error reading file: ${err}`);
    process.exit(1);
  }

  try {
    const jsonData = JSON.parse(data);
    jsonToTable(jsonData);
  } catch (parseErr) {
    console.error(`Error parsing JSON: ${parseErr}`);
    process.exit(1);
  }
});
