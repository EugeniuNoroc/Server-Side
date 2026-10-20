const http = require('http');

// Форматирование даты: 09.09.2026 15:25
function formatDate(date) {
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ` +
           `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const student = {
    name: 'Eugeniu',
    surname: 'Noroc',
    group: 'IA2403',
    speciality: 'Applied Informatics'
};

const courses = [
    { title: 'Server-Side Development', teacher: 'Ion Popescu', credits: 5 },
    { title: 'Databases', teacher: 'Maria Rusu', credits: 6 },
    { title: 'Computer Networks', teacher: 'Andrei Ciobanu', credits: 4 }
];

const quotes = [
    'Talk is cheap. Show me the code. — Linus Torvalds',
    'First, solve the problem. Then, write the code. — John Johnson',
    'Simplicity is the soul of efficiency. — Austin Freeman'
];

const books = [
    { id: 1, title: 'Clean Code', author: 'Robert Martin', year: 2008, genre: 'programming' },
    { id: 2, title: 'The Pragmatic Programmer', author: 'Andrew Hunt', year: 1999, genre: 'programming' },
    { id: 3, title: 'Eloquent JavaScript', author: 'Martin Haverbeke', year: 2018, genre: 'javascript' },
    { id: 4, title: 'You Don\'t Know JS', author: 'Kyle Simpson', year: 2015, genre: 'javascript' },
    { id: 5, title: 'Dune', author: 'Frank Herbert', year: 1965, genre: 'fiction' },
    { id: 6, title: '1984', author: 'George Orwell', year: 1949, genre: 'fiction' }
];

const server = http.createServer((req, res) => {

    console.log(`${req.method} ${req.url} | ${formatDate(new Date())}`);

    const url = new URL(req.url, `http://${req.headers.host}`);
    const path = url.pathname;
    const params = url.searchParams;

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    if (req.method === 'GET' && path === '/') {
        res.end('Welcome! This is my first Node.js server.');
    }
    else if (req.method === 'GET' && path === '/about') {
        res.end('This application is a simple HTTP server built with Node.js (http module).');
    }
    else if (req.method === 'GET' && path === '/student') {
        res.end(`Student: ${student.name} ${student.surname}, group: ${student.group}`);
    }
    else if (req.method === 'GET' && path === '/api/student') {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify(student));
    }
    else if (req.method === 'GET' && path === '/time') {
        res.end(`Current date and time: ${formatDate(new Date())}`);
    }
    else if (req.method === 'GET' && path === '/api/courses') {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify(courses));
    }
    // Собственный маршрут
    else if (req.method === 'GET' && path === '/api/quote') {
        const quote = quotes[Math.floor(Math.random() * quotes.length)];
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify({ quote }));
    }
    // Фильтрация по имени:
    // greet?name=Eugeniu
    else if (req.method === 'GET' && path === '/greet') {
        const name = params.get('name') || 'Guest';
        res.end(`Hello, ${name}!`);
    }
    // Фильтрация книг по параметрам:
    // /api/books?genre=fiction
    // /api/books?author=martin
    // /api/books?minYear=2000&maxYear=2015
    // /api/books?genre=javascript&minYear=2016
    else if (req.method === 'GET' && path === '/api/books') {
        const genre = params.get('genre');
        const author = params.get('author');
        const minYear = params.get('minYear');
        const maxYear = params.get('maxYear');

        let result = books;

        if (genre) {
            result = result.filter(b => b.genre === genre.toLowerCase());
        }
        if (author) {
            result = result.filter(b => b.author.toLowerCase().includes(author.toLowerCase()));
        }
        if (minYear) {
            result = result.filter(b => b.year >= Number(minYear));
        }
        if (maxYear) {
            result = result.filter(b => b.year <= Number(maxYear));
        }

        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify({ count: result.length, books: result }));
    }
    else {
        res.statusCode = 404;
        res.end('404 - Page not found');
    }
});

server.listen(3000, () => {
    console.log('Server is running at http://localhost:3000');
});