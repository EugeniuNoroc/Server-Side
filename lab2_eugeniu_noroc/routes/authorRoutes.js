// Маршруты авторов: только привязка URL к функциям контроллера

const express = require("express");
const authorController = require("../controllers/authorController");

const router = express.Router();

router.get("/", authorController.getAllAuthors);
router.get("/:id", authorController.getAuthorById);
router.get("/:id/books", authorController.getAuthorBooks);

module.exports = router;
