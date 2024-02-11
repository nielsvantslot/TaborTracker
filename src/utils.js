export async function getCurrentTime() {
    const now = new Date();

    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();

    const formattedHour = currentHour < 10 ? '0' + currentHour : currentHour;
    const formattedMinutes = currentMinutes < 10 ? '0' + currentMinutes : currentMinutes;

    const currentTime = formattedHour + ':' + formattedMinutes;
    return currentTime;
}
