// Format Current Time
const formatCurrentTime = () => {
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const year = now.getFullYear();
    const hours = now.getHours().toString().padStart(2, '0'); // Hours
    const minutes = now.getMinutes().toString().padStart(2, '0'); // Minutes
    const seconds = now.getSeconds().toString().padStart(2, '0'); // Seconds

    return `${month}/${day}/${year} and ${hours}:${minutes}:${seconds}`;
}

module.exports.formatCurrentTime = formatCurrentTime