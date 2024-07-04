import path from 'path';
import { __dirname } from '../src/utils.js';
import FileManager from '../src/managers/data/FileManager.js';

const main = async () => {
  // Get the filename from command line arguments
  const args = process.argv.slice(2);

  const listAndExit = async () => {
    await FileManager.listFiles(['/data/dynamic', '/data/static']);
  };

  if (args.length <= 0) {
    await listAndExit();
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

  // Use FileManager to read the file
  const fileManager = new FileManager(folder, filename);
  try {
    const jsonData = await fileManager.readFromFile();
    if (jsonData) {
      FileManager.jsonToTable(jsonData);
    }
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
