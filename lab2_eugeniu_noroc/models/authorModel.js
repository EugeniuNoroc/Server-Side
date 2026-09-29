// Модель авторов: хранит данные в массиве и даёт функции доступа к ним

const authors = [
  { id: 1, name: "J. R. R. Tolkien", country: "United Kingdom" },
  { id: 2, name: "George Orwell", country: "United Kingdom" },
  { id: 3, name: "Robert C. Martin", country: "USA" },
  { id: 4, name: "Mario Casciaro", country: "Italy" }
];

// Получить всех авторов
function getAll() {
  return authors;
}

// Найти автора по id (если не найден — вернётся undefined)
function getById(id) {
  return authors.find((author) => author.id === id);
}

module.exports = {
  getAll,
  getById
};
