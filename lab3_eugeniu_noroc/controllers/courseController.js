const Course = require('../models/courseModel');

// Вспомогательная функция для страницы 404
function renderNotFound(req, res) {
    res.status(404).render('404', {
        title: '404 Not Found',
        url: req.originalUrl
    });
}

// Приведение данных формы к нужным типам
function parseCourse(body) {
    return {
        title: body.title.trim(),
        teacher: body.teacher.trim(),
        credits: Number(body.credits),
        semester: Number(body.semester),
        description: body.description.trim()
    };
}

// GET /courses (+ ?search=...&semester=...)
exports.getAllCourses = (req, res) => {
    const search = (req.query.search || '').trim();
    const semester = (req.query.semester || '').trim();

    let courses = Course.getAll();

    if (search) {
        const term = search.toLowerCase();
        courses = courses.filter(c =>
            c.title.toLowerCase().includes(term) ||
            c.teacher.toLowerCase().includes(term)
        );
    }

    if (semester) {
        courses = courses.filter(c => c.semester === Number(semester));
    }

    res.render('courses/index', {
        title: 'Список курсов',
        courses,
        search,
        semester
    });
};

// GET /courses/:id
exports.getCourseById = (req, res) => {
    const course = Course.getById(req.params.id);
    if (!course) return renderNotFound(req, res);

    res.render('courses/details', { title: course.title, course });
};

// GET /courses/new
exports.showCreateForm = (req, res) => {
    res.render('courses/create', {
        title: 'Добавить курс',
        errors: [],
        course: {}
    });
};

// POST /courses
exports.createCourse = (req, res) => {
    Course.create(parseCourse(req.body));
    res.redirect('/courses');
};

// GET /courses/:id/edit
exports.showEditForm = (req, res) => {
    const course = Course.getById(req.params.id);
    if (!course) return renderNotFound(req, res);

    res.render('courses/edit', {
        title: 'Редактировать курс',
        errors: [],
        course
    });
};

// POST /courses/:id/edit
exports.updateCourse = (req, res) => {
    const course = Course.update(req.params.id, parseCourse(req.body));
    if (!course) return renderNotFound(req, res);

    res.redirect(`/courses/${course.id}`);
};

// POST /courses/:id/delete
exports.deleteCourse = (req, res) => {
    const deleted = Course.remove(req.params.id);
    if (!deleted) return renderNotFound(req, res);

    res.redirect('/courses');
};
