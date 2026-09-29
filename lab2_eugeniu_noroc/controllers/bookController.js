// Контроллер книг: обработка запросов, валидация и статус-коды

const bookModel = require("../models/bookModel");
const authorModel = require("../models/authorModel");

// GET /api/books — все книги, с фильтрацией по ?genre= и ?year=
function getAllBooks(req, res) {
  let result = bookModel.getAll();
  const genre = req.query.genre;
  const year = req.query.year;

  // Фильтр по жанру (без учёта регистра)
  if (genre) {
    result = result.filter(
      (book) => book.genre.toLowerCase() === genre.toLowerCase()
    );
  }

  // Фильтр по году (сравниваем как число)
  if (year) {
    result = result.filter((book) => book.year === Number(year));
  }

  res.status(200).json(result);
}

// GET /api/books/search?title= — поиск по части названия
function searchBooks(req, res) {
  const title = req.query.title;

  if (!title) {
    return res.status(400).json({ error: "Query parameter 'title' is required" });
  }

  const result = bookModel
    .getAll()
    .filter((book) => book.title.toLowerCase().includes(title.toLowerCase()));

  // Если ничего не найдено — вернётся пустой массив []
  res.status(200).json(result);
}

// GET /api/books/:id — книга по id
function getBookById(req, res) {
  const id = Number(req.params.id);
  const book = bookModel.getById(id);

  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }

  res.status(200).json(book);
}

// POST /api/books — добавление книги
function createBook(req, res) {
  const body = req.body || {};
  const requiredFields = ["title", "authorId", "genre", "year"];

  // Собираем список отсутствующих полей
  const missing = requiredFields.filter(
    (field) => body[field] === undefined || body[field] === null || body[field] === ""
  );

  if (missing.length > 0) {
    return res
      .status(400)
      .json({ error: "Missing required fields: " + missing.join(", ") });
  }

  // authorId и year должны быть числами
  if (typeof body.authorId !== "number" || typeof body.year !== "number") {
    return res.status(400).json({ error: "authorId and year must be numbers" });
  }

  // Задание 8.3: проверяем, что автор существует
  if (!authorModel.getById(body.authorId)) {
    return res.status(400).json({ error: "Author with this id does not exist" });
  }

  const newBook = bookModel.create(body);
  res.status(201).json(newBook);
}

// PATCH /api/books/:id — частичное изменение книги
function updateBook(req, res) {
  const id = Number(req.params.id);
  const body = req.body || {};

  if (!bookModel.getById(id)) {
    return res.status(404).json({ error: "Book not found" });
  }

  // Берём только разрешённые поля (id менять нельзя)
  const allowedFields = ["title", "authorId", "genre", "year"];
  const changes = {};
  allowedFields.forEach((field) => {
    if (body[field] !== undefined) {
      changes[field] = body[field];
    }
  });

  // Если передан authorId — он должен быть числом и автор должен существовать
  if (changes.authorId !== undefined) {
    if (typeof changes.authorId !== "number") {
      return res.status(400).json({ error: "authorId must be a number" });
    }
    if (!authorModel.getById(changes.authorId)) {
      return res.status(400).json({ error: "Author with this id does not exist" });
    }
  }

  // Если передан year — он должен быть числом
  if (changes.year !== undefined && typeof changes.year !== "number") {
    return res.status(400).json({ error: "year must be a number" });
  }

  const updatedBook = bookModel.update(id, changes);
  res.status(200).json(updatedBook);
}

// DELETE /api/books/:id — удаление книги
function deleteBook(req, res) {
  const id = Number(req.params.id);
  const deletedBook = bookModel.remove(id);

  if (!deletedBook) {
    return res.status(404).json({ error: "Book not found" });
  }

  res.status(200).json({ message: "Book deleted", book: deletedBook });
}

// GET /api/statistics — статистика (задание 8.2)
function getStatistics(req, res) {
  const books = bookModel.getAll();
  const authors = authorModel.getAll();

  // Уникальные жанры через Set
  const genres = new Set(books.map((book) => book.genre.toLowerCase()));

  let newestBook = null;
  let oldestBook = null;

  books.forEach((book) => {
    if (newestBook === null || book.year > newestBook.year) {
      newestBook = book;
    }
    if (oldestBook === null || book.year < oldestBook.year) {
      oldestBook = book;
    }
  });

  res.status(200).json({
    booksCount: books.length,
    authorsCount: authors.length,
    genresCount: genres.size,
    newestBook: newestBook,
    oldestBook: oldestBook
  });
}

module.exports = {
  getAllBooks,
  searchBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getStatistics
};
