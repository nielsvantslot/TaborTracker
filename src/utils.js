import path from 'path';

export const __filename = new URL(import.meta.url).pathname;
export const __dirname = path.resolve();

export async function getCurrentTime() {
  const now = new Date();

  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();

  const formattedHour = currentHour < 10 ? "0" + currentHour : currentHour;
  const formattedMinutes =
    currentMinutes < 10 ? "0" + currentMinutes : currentMinutes;

  const currentTime = formattedHour + ":" + formattedMinutes;
  return currentTime;
}

function timestamp_date(timestamp, format) {
    let date = new Date(timestamp);

    switch(format) {
        case 'toDateString':
            return date.toDateString(); // Example: "Fri Jul 02 2021"
        case 'toTimeString':
            return date.toTimeString(); // Example: "17:00:00 GMT-0700 (Pacific Daylight Time)"
        case 'toISOString':
            return date.toISOString(); // Example: "2021-07-02T00:00:00.000Z"
        case 'toLocaleString':
            return date.toLocaleString(); // Example: "7/2/2021, 5:00:00 PM"
        case 'toLocaleDateString':
            return date.toLocaleDateString(); // Example: "7/2/2021"
        case 'toLocaleTimeString':
            return date.toLocaleTimeString(); // Example: "5:00:00 PM"
        case 'toUTCString':
            return date.toUTCString(); // Example: "Fri, 02 Jul 2021 00:00:00 GMT"
        case 'toDate':
            return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`; // Example: "2021-7-2"
        case 'toHMS':
            return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`; // Example: "17:00:0"
        case 'toHM':
            return `${date.getHours()}:${date.getMinutes()}`; // Example: "17:00"
        default:
            return 'Invalid format';
    }
}
