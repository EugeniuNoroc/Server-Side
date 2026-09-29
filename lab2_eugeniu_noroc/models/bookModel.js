// Модель книг: хранит данные в массиве и даёт функции доступа к ним

const books = [
  { id: 1, title: "The Hobbit", authorId: 1, genre: "fantasy", year: 1937 },
  { id: 2, title: "1984", authorId: 2, genre: "dystopia", year: 1949 },
  { id: 3, title: "Clean Code", authorId: 3, genre: "programming", year: 2008 },
  { id: 4, title: "The Lord of the Rings", authorId: 1, genre: "fantasy", year: 1954 },
  { id: 5, title: "Animal Farm", authorId: 2, genre: "satire", year: 1945 },
  { id: 6, title: "Node.js Design Patterns", authorId: 4, genre: "programming", year: 2014 }
];

// Получить все книги
function getAll() {
  return books;
}

// Найти книгу по id
function getById(id) {
  return books.find((book) => book.id === id);
}

// Получить все книги автора
function getByAuthorId(authorId) {
  return books.filter((book) => book.authorId === authorId);
}

// Сгенерировать новый id: максимальный существующий id + 1
function getNextId() {
  if (books.length === 0) {
    return 1;
  }
  const ids = books.map((book) => book.id);
  return Math.max(...ids) + 1;
}

// Добавить новую книгу
function create(data) {
  const newBook = {
    id: getNextId(),
    title: data.title,
    authorId: data.authorId,
    genre: data.genre,
    year: data.year
  };
  books.push(newBook);
  return newBook;
}

// Обновить книгу (меняем только переданные поля)
function update(id, data) {
  const book = getById(id);
  if (!book) {
    return null;
  }
  Object.assign(book, data);
  return book;
}

// Удалить книгу, вернуть удалённую книгу
function remove(id) {
  const index = books.findIndex((book) => book.id === id);
  if (index === -1) {
    return null;
  }
  const deleted = books.splice(index, 1);
  return deleted[0];
}

module.exports = {
  getAll,
  getById,
  getByAuthorId,
  create,
  update,
  remove
};
