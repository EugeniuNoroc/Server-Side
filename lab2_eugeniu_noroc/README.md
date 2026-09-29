# Лабораторная работа 2 — REST API на Node.js + Express.js

## Как запустить

```bash
npm install
npm start
```

Сервер запускается на `http://localhost:3000`. Примеры всех запросов — в файле `requests.http` (расширение REST Client для VS Code).

## Маршруты

| Метод  | URL                              | Описание                                   |
|--------|----------------------------------|--------------------------------------------|
| GET    | /api/books                       | Все книги (фильтры `?genre=`, `?year=`)    |
| GET    | /api/books/search?title=         | Поиск по части названия                    |
| GET    | /api/books/:id                   | Книга по id                                |
| POST   | /api/books                       | Добавление книги                           |
| PATCH  | /api/books/:id                   | Частичное изменение книги                  |
| DELETE | /api/books/:id                   | Удаление книги                             |
| GET    | /api/authors                     | Все авторы                                 |
| GET    | /api/authors/:id                 | Автор по id                                |
| GET    | /api/authors/:id/books           | Книги автора                               |
| GET    | /api/statistics                  | Статистика                                 |

## Ответы на вопросы защиты

**Разница Node.js и Express.js.**
Node.js — среда выполнения JavaScript вне браузера (на движке V8), даёт доступ к файлам, сети и т.д. Express.js — фреймворк (библиотека) для Node.js, который упрощает создание веб-сервера: маршрутизация, middleware, удобные `req`/`res` (`res.json()`, `res.status()`). Без Express пришлось бы вручную разбирать URL и тело запроса через модуль `http`.

**Что такое MVC и где он в проекте.**
MVC (Model–View–Controller) — разделение кода по ответственности:
- **Model** — данные и работа с ними: `models/bookModel.js`, `models/authorModel.js` (массивы и функции `getAll`, `getById`, `create`, `update`, `remove`);
- **View** — представление результата; в REST API это JSON-ответ (`res.json(...)`);
- **Controller** — логика обработки запроса: `controllers/bookController.js`, `controllers/authorController.js` (валидация, статус-коды, вызов модели).

Маршруты (`routes/`) связывают URL с контроллерами.

**Назначение Router и Controller.**
Router (`express.Router()`) — только описывает, какой метод и URL какую функцию вызывает, например `router.get("/:id", bookController.getBookById)`. Controller — содержит саму логику: достаёт данные из запроса, проверяет их, обращается к модели и отправляет ответ с нужным статусом.

**req.params, req.query, req.body.**
- `req.params` — параметры пути. `GET /api/books/3` → `req.params.id === "3"` (строка, поэтому `Number(req.params.id)`).
- `req.query` — параметры после `?`. `GET /api/books?genre=fantasy&year=1937` → `req.query.genre === "fantasy"`, `req.query.year === "1937"`; `GET /api/books/search?title=node` → `req.query.title === "node"`.
- `req.body` — тело запроса (JSON), доступно благодаря `app.use(express.json())`. `POST /api/books` с телом `{ "title": "The Clean Coder", "authorId": 3, "genre": "programming", "year": 2011 }` → `req.body.title === "The Clean Coder"`.
