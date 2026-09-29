// Middleware-логгер: выводит в консоль метод, адрес и дату запроса
// Формат: GET | /api/books | 30.09.2026 14:25

// Добавляет ведущий ноль: 5 -> "05"
function pad(number) {
  return String(number).padStart(2, "0");
}

function logger(req, res, next) {
  const now = new Date();

  const date =
    pad(now.getDate()) + "." +
    pad(now.getMonth() + 1) + "." +
    now.getFullYear() + " " +
    pad(now.getHours()) + ":" +
    pad(now.getMinutes());

  console.log(req.method + " | " + req.originalUrl + " | " + date);

  // Передаём управление дальше
  next();
}

module.exports = logger;
