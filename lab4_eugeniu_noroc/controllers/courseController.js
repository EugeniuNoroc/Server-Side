const { Op, ValidationError, ForeignKeyConstraintError } = require('sequelize');
const { Course, Teacher } = require('../models');
const { parseId } = require('../middleware/validateData');

function render404(req, res) {
    return res.status(404).render('404', { title: '404 Not Found', url: req.originalUrl });
}

// Повторный показ формы при ошибке Sequelize (на случай, если что-то прошло мимо middleware)
async function renderFormWithErrors(res, view, course, err) {
    let errors;
    if (err instanceof ForeignKeyConstraintError) {
        errors = ['Выбранный преподаватель не существует'];
    } else {
        errors = err.errors ? err.errors.map(e => e.message) : ['Некорректные данные'];
    }
    const teachers = await Teacher.findAll({ order: [['name', 'ASC']] });
    return res.status(400).render(view, {
        title: view === 'courses/edit' ? 'Редактировать курс' : 'Добавить курс',
        errors,
        course,
        teachers
    });
}

// GET /courses?search=&teacherId=&semester=
exports.getAllCourses = async (req, res, next) => {
    try {
        const search = (req.query.search || '').trim();
        const teacherId = parseId(req.query.teacherId);
        const semester = parseId(req.query.semester);

        // Все условия собираются в where и выполняются в базе данных
        const where = {};
        if (search) where.title = { [Op.iLike]: `%${search}%` };
        if (teacherId) where.teacherId = teacherId;
        if (semester) where.semester = semester;

        const courses = await Course.findAll({
            where,
            include: Teacher,
            order: [['semester', 'ASC'], ['title', 'ASC']]
        });

        const teachers = await Teacher.findAll({ order: [['name', 'ASC']] });

        res.render('courses/index', {
            title: 'Список курсов',
            courses,
            teachers,
            search,
            teacherId: teacherId || '',
            semester: semester || ''
        });
    } catch (err) {
        next(err);
    }
};

// GET /courses/:id
exports.getCourseById = async (req, res, next) => {
    try {
        const id = parseId(req.params.id);
        if (!id) return render404(req, res);

        const course = await Course.findByPk(id, { include: Teacher });
        if (!course) return render404(req, res);

        res.render('courses/details', { title: course.title, course });
    } catch (err) {
        next(err);
    }
};

// GET /courses/new
exports.showCreateForm = async (req, res, next) => {
    try {
        const teachers = await Teacher.findAll({ order: [['name', 'ASC']] });
        res.render('courses/create', {
            title: 'Добавить курс',
            errors: [],
            course: {},
            teachers
        });
    } catch (err) {
        next(err);
    }
};

// POST /courses
exports.createCourse = async (req, res, next) => {
    try {
        await Course.create(req.validData);
        res.redirect('/courses');
    } catch (err) {
        if (err instanceof ValidationError || err instanceof ForeignKeyConstraintError) {
            return renderFormWithErrors(res, 'courses/create', req.body, err);
        }
        next(err);
    }
};

// GET /courses/:id/edit
exports.showEditForm = async (req, res, next) => {
    try {
        const id = parseId(req.params.id);
        if (!id) return render404(req, res);

        const course = await Course.findByPk(id);
        if (!course) return render404(req, res);

        const teachers = await Teacher.findAll({ order: [['name', 'ASC']] });
        res.render('courses/edit', {
            title: 'Редактировать курс',
            errors: [],
            course,
            teachers
        });
    } catch (err) {
        next(err);
    }
};

// POST /courses/:id/edit
exports.updateCourse = async (req, res, next) => {
    const id = parseId(req.params.id);
    try {
        if (!id) return render404(req, res);

        const course = await Course.findByPk(id);
        if (!course) return render404(req, res);

        await course.update(req.validData);
        res.redirect(`/courses/${course.id}`);
    } catch (err) {
        if (err instanceof ValidationError || err instanceof ForeignKeyConstraintError) {
            return renderFormWithErrors(res, 'courses/edit', { id, ...req.body }, err);
        }
        next(err);
    }
};

// POST /courses/:id/delete
exports.deleteCourse = async (req, res, next) => {
    try {
        const id = parseId(req.params.id);
        if (!id) return render404(req, res);

        const course = await Course.findByPk(id);
        if (!course) return render404(req, res);

        await course.destroy();
        res.redirect('/courses');
    } catch (err) {
        next(err);
    }
};
