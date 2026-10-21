const express = require('express');
const app = express();

const logger = require('./middleware/logger');
const courseRoutes = require('./routes/courseRoutes');

const PORT = 3000;

// Настройка EJS
app.set('view engine', 'ejs');
app.set('views', './views');

// Обработка данных HTML-форм
app.use(express.urlencoded({ extended: true }));

// Статические файлы (CSS)
app.use(express.static('public'));

// Логирование всех запросов (до маршрутов)
app.use(logger);

// Главная страница -> список курсов
app.get('/', (req, res) => {
    res.redirect('/courses');
});

// Маршруты курсов
app.use('/courses', courseRoutes);

// 404 — маршрут не найден
app.use((req, res) => {
    res.status(404).render('404', {
        title: '404 Not Found',
        url: req.originalUrl
    });
});

// Обработчик внутренних ошибок (stack trace только в терминал)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', {
        title: 'Ошибка сервера',
        message: 'Произошла внутренняя ошибка приложения. Попробуйте позже.'
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});
