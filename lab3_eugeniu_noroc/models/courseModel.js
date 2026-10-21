// Данные хранятся в массиве (до подключения БД в следующей лабораторной)
const courses = [
    {
        id: 1,
        title: 'Server-side Programming',
        teacher: 'Ivan Ivanov',
        credits: 5,
        semester: 1,
        description: 'Development of server-side applications using Node.js'
    },
    {
        id: 2,
        title: 'Web Design',
        teacher: 'Maria Popescu',
        credits: 4,
        semester: 1,
        description: 'Basics of HTML, CSS and responsive design'
    },
    {
        id: 3,
        title: 'Databases',
        teacher: 'Andrei Rusu',
        credits: 6,
        semester: 2,
        description: 'Relational databases, SQL and data modeling'
    },
    {
        id: 4,
        title: 'Object-Oriented Programming',
        teacher: 'Ivan Petrov',
        credits: 5,
        semester: 2,
        description: 'Classes, objects, inheritance and polymorphism'
    },
    {
        id: 5,
        title: 'Computer Networks',
        teacher: 'Elena Ciobanu',
        credits: 4,
        semester: 3,
        description: 'Network models, protocols TCP/IP and routing'
    },
    {
        id: 6,
        title: 'Frontend Frameworks',
        teacher: 'Victor Lungu',
        credits: 5,
        semester: 4,
        description: 'Building single-page applications with modern frameworks'
    }
];

let nextId = courses.length + 1;

function getAll() {
    return courses;
}

function getById(id) {
    return courses.find(c => c.id === Number(id));
}

function create(data) {
    const course = { id: nextId++, ...data };
    courses.push(course);
    return course;
}

function update(id, data) {
    const course = getById(id);
    if (!course) return null;
    Object.assign(course, data);
    return course;
}

function remove(id) {
    const index = courses.findIndex(c => c.id === Number(id));
    if (index === -1) return false;
    courses.splice(index, 1);
    return true;
}

module.exports = { courses, getAll, getById, create, update, remove };
