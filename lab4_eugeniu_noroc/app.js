require('dotenv').config();

const express = require('express');
const app = express();

const { sequelize, seedIfEmpty } = require('./models');
const logger = require('./middleware/logger');
const courseRoutes = require('./routes/courseRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const statisticsController = require('./controllers/statisticsController');

const PORT = process.env.PORT || 3000;

// Настройка EJS
app.set('view engine', 'ejs');
app.set('views', './views');

// Обработка данных HTML-форм и статические файлы
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Логирование всех запросов (до маршрутов)
app.use(logger);

// Маршруты
app.get('/', (req, res) => res.redirect('/courses'));
app.use('/courses', courseRoutes);
app.use('/teachers', teacherRoutes);
app.get('/statistics', statisticsController.getStatistics);

// 404 — маршрут не найден
app.use((req, res) => {
    res.status(404).render('404', {
        title: '404 Not Found',
        url: req.originalUrl
    });
});

// Обработчик внутренних ошибок (stack trace только в терминал)
app.use((err, req, res, next) => {
    console.error('Ошибка:', err.message);
    res.status(500).render('error', {
        title: 'Ошибка сервера',
        message: 'Произошла внутренняя ошибка приложения. Попробуйте позже.'
    });
});

// Запуск: проверка подключения -> синхронизация таблиц -> сервер
async function start() {
    try {
        await sequelize.authenticate();
        console.log('Database connection established');

        await sequelize.sync(); // без force: данные не удаляются
        await seedIfEmpty();

        app.listen(PORT, () => {
            console.log(`Сервер запущен: http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Не удалось подключиться к базе данных PostgreSQL.');
        console.error('Проверьте, что PostgreSQL запущен, база данных "' + process.env.DB_NAME + '" создана,');
        console.error('а параметры в файле .env указаны верно.');
        const reason = err.message
            || (err.original && (err.original.code || err.original.message))
            || (err.parent && err.parent.errors && err.parent.errors.map(e => e.code + ' ' + e.address + ':' + e.port).join(', '))
            || String(err);
        console.error('Причина: ' + reason);
        process.exitCode = 1;
    }
}

start();
