// Точка входа приложения

const express = require("express");
const logger = require("./middleware/logger");
const bookRoutes = require("./routes/bookRoutes");
const authorRoutes = require("./routes/authorRoutes");
const bookController = require("./controllers/bookController");

const app = express();
const PORT = 3000;

// Разбор JSON в теле запроса (req.body)
app.use(express.json());

// Логгер
app.use(logger);

// Роутеры
app.use("/api/books", bookRoutes);
app.use("/api/authors", authorRoutes);

// Статистика
app.get("/api/statistics", bookController.getStatistics);

// Неизвестные маршруты
app.use((req, res) => res.status(404).json({ error: "Route not found" }));

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});
