
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


// Get lastweek Orders
function getLastWeekOrders(orders) {
    const now = new Date();
    const oneWeekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

    const lastWeekOrders = orders.filter((order) => {
        const orderTime = new Date(order.time);
        return orderTime >= oneWeekAgo && orderTime <= now;
    });

    return lastWeekOrders;
}

// Get weekly orders
const getWeeklyOrderCounts = (orders) => {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeklyOrders = {};

    for (const order of orders) {
        const orderDate = new Date(parseCustomDate(order.time));
        const dayOfWeek = daysOfWeek[orderDate.getUTCDay()];
        const orderItemsCount = order.cardItems.length;

        if (weeklyOrders[dayOfWeek]) {
            weeklyOrders[dayOfWeek] += orderItemsCount;
        } else {
            weeklyOrders[dayOfWeek] = orderItemsCount;
        }
    }

    for (let week of daysOfWeek) {
        if (!(week in weeklyOrders)) {
            weeklyOrders[week] = 0
        }
    }

    const weekOrders = {
        Mon: weeklyOrders.Mon,
        Tue: weeklyOrders.Tue,
        Wed: weeklyOrders.Wed,
        Thu: weeklyOrders.Thu,
        Fri: weeklyOrders.Fri,
        Sat: weeklyOrders.Sat,
        Sun: weeklyOrders.Sun
    }
    return Object.values(weekOrders);
}

// Get monthy orders
const categorizeOrdersIntoWeeks = (orders) => {

    const categorizedOrders = {
        "Week-1": 0,
        "Week-2": 0,
        "Week-3": 0,
        "Week-4": 0,
    };

    for (const order of orders) {
        const orderDate = new Date(parseCustomDate(order.time));
        const day = orderDate.getDate();

        if (day <= 7) {
            categorizedOrders["Week-1"] += order.cardItems.length;
        } else if (day <= 14) {
            categorizedOrders["Week-2"] += order.cardItems.length;
        } else if (day <= 21) {
            categorizedOrders["Week-3"] += order.cardItems.length;
        } else {
            categorizedOrders["Week-4"] += order.cardItems.length;
        }
    }

    return Object.values(categorizedOrders);
};

function parseCustomDate(customDate) {
    const [datePart, timePart] = customDate.split(' and ');
    const [month, day, year] = datePart.split('/').map(Number);
    const [hours, minutes, seconds] = timePart.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes, seconds);
}

module.exports.formatCurrentTime = formatCurrentTime
module.exports.getLastWeekOrders = getLastWeekOrders
module.exports.getWeeklyOrderCounts = getWeeklyOrderCounts
module.exports.categorizeOrdersIntoWeeks = categorizeOrdersIntoWeeks