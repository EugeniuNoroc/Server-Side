// Маршруты книг: только привязка URL к функциям контроллера

const express = require("express");
const bookController = require("../controllers/bookController");

const router = express.Router();

// /search объявлен до /:id, иначе "search" будет воспринят как id
router.get("/search", bookController.searchBooks);
router.get("/", bookController.getAllBooks);
router.get("/:id", bookController.getBookById);
router.post("/", bookController.createBook);
router.patch("/:id", bookController.updateBook);
router.delete("/:id", bookController.deleteBook);

module.exports = router;
