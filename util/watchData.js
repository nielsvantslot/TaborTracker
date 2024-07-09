import fs from 'fs';
import path from 'path';
import { __dirname } from '../src/utils.js';
import FileManager from '../src/managers/data/FileManager.js';

/**
 * Watches a file for changes and executes a callback function when the file changes.
 * @param {string} filePath - The path of the file to watch.
 * @param {Function} callback - The function to call when the file changes.
 */
const watchFile = (filePath, callback) => {
  fs.watch(filePath, async (eventType) => {
    if (eventType === 'change') {
      try {
        const data = await callback();
        if (data) {
          FileManager.jsonToTable(data);
        }
      } catch (err) {
        console.error(err.message);
      }
    }
  });
};

/**
 * Main function to handle command line arguments, read and display file content, and set up file watcher.
 */
const main = async () => {
  // Get the filename from command line arguments
  const args = process.argv.slice(2);

  // If no arguments are provided, list files and exit
  if (args.length <= 0) {
    await FileManager.listFiles(['/data/dynamic', '/data/static']);
  }

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

  // Create a FileManager instance and get the file path
  const fileManager = new FileManager(folder, filename);
  const filePath = path.join(__dirname, folder, filename);

  try {
    // Initial read and display
    const jsonData = await fileManager.readFromFile();
    if (jsonData) {
      FileManager.jsonToTable(jsonData);
    }

    // Set up file watcher
    watchFile(filePath, async () => {
      return await fileManager.readFromFile();
    });

  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

// Invoke the main async function
main().catch(err => {
  console.error('Unhandled error in main function:', err);
  process.exit(1);
});
