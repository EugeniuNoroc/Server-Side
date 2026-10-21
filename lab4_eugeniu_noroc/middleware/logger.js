// Логирование: HTTP Method | URL | Date and Time
function pad(n) {
    return String(n).padStart(2, '0');
}

function logger(req, res, next) {
    const d = new Date();
    const date = `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
    const time = `${pad(d.getHours())}:${pad(d.getMinutes())}`;

    console.log(`${req.method} | ${req.originalUrl} | ${date} ${time}`);
    next();
}

module.exports = logger;
