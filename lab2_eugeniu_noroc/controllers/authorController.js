// Контроллер авторов: обработка запросов и статус-коды

const authorModel = require("../models/authorModel");
const bookModel = require("../models/bookModel");

// GET /api/authors — все авторы
function getAllAuthors(req, res) {
  res.status(200).json(authorModel.getAll());
}

// GET /api/authors/:id — автор по id
function getAuthorById(req, res) {
  const id = Number(req.params.id);
  const author = authorModel.getById(id);

  if (!author) {
    return res.status(404).json({ error: "Author not found" });
  }

  res.status(200).json(author);
}

// GET /api/authors/:id/books — книги автора
function getAuthorBooks(req, res) {
  const id = Number(req.params.id);
  const author = authorModel.getById(id);

  if (!author) {
    return res.status(404).json({ error: "Author not found" });
  }

  res.status(200).json(bookModel.getByAuthorId(id));
}

module.exports = {
  getAllAuthors,
  getAuthorById,
  getAuthorBooks
};
