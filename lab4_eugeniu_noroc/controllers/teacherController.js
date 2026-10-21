const { fn, col, ValidationError, ForeignKeyConstraintError } = require('sequelize');
const { Teacher, Course } = require('../models');
const { parseId } = require('../middleware/validateData');

function render404(req, res) {
    return res.status(404).render('404', { title: '404 Not Found', url: req.originalUrl });
}

function sequelizeErrors(err) {
    // UniqueConstraintError тоже является ValidationError
    if (err.name === 'SequelizeUniqueConstraintError') {
        return ['Преподаватель с таким email уже существует'];
    }
    return err.errors ? err.errors.map(e => e.message) : ['Некорректные данные'];
}

// GET /teachers — список с количеством курсов (COUNT в базе данных)
exports.getAllTeachers = async (req, res, next) => {
    try {
        const teachers = await Teacher.findAll({
            attributes: {
                include: [[fn('COUNT', col('Courses.id')), 'courseCount']]
            },
            include: [{ model: Course, attributes: [] }],
            group: ['Teacher.id'],
            order: [['name', 'ASC']]
        });

        res.render('teachers/index', { title: 'Преподаватели', teachers });
    } catch (err) {
        next(err);
    }
};

// GET /teachers/:id — преподаватель и его курсы через связь hasMany
exports.getTeacherById = async (req, res, next) => {
    try {
        const id = parseId(req.params.id);
        if (!id) return render404(req, res);

        const teacher = await Teacher.findByPk(id, {
            include: Course,
            order: [[Course, 'semester', 'ASC'], [Course, 'title', 'ASC']]
        });
        if (!teacher) return render404(req, res);

        res.render('teachers/details', { title: teacher.name, teacher, error: null });
    } catch (err) {
        next(err);
    }
};

// GET /teachers/new
exports.showCreateForm = (req, res) => {
    res.render('teachers/create', {
        title: 'Добавить преподавателя',
        errors: [],
        teacher: {}
    });
};

// POST /teachers
exports.createTeacher = async (req, res, next) => {
    try {
        await Teacher.create(req.validData);
        res.redirect('/teachers');
    } catch (err) {
        if (err instanceof ValidationError) {
            return res.status(400).render('teachers/create', {
                title: 'Добавить преподавателя',
                errors: sequelizeErrors(err),
                teacher: req.body
            });
        }
        next(err);
    }
};

// GET /teachers/:id/edit
exports.showEditForm = async (req, res, next) => {
    try {
        const id = parseId(req.params.id);
        if (!id) return render404(req, res);

        const teacher = await Teacher.findByPk(id);
        if (!teacher) return render404(req, res);

        res.render('teachers/edit', {
            title: 'Редактировать преподавателя',
            errors: [],
            teacher
        });
    } catch (err) {
        next(err);
    }
};

// POST /teachers/:id/edit
exports.updateTeacher = async (req, res, next) => {
    const id = parseId(req.params.id);
    try {
        if (!id) return render404(req, res);

        const teacher = await Teacher.findByPk(id);
        if (!teacher) return render404(req, res);

        await teacher.update(req.validData);
        res.redirect(`/teachers/${teacher.id}`);
    } catch (err) {
        if (err instanceof ValidationError) {
            return res.status(400).render('teachers/edit', {
                title: 'Редактировать преподавателя',
                errors: sequelizeErrors(err),
                teacher: { id, ...req.body }
            });
        }
        next(err);
    }
};

// POST /teachers/:id/delete — нельзя удалить преподавателя, у которого есть курсы
exports.deleteTeacher = async (req, res, next) => {
    try {
        const id = parseId(req.params.id);
        if (!id) return render404(req, res);

        const teacher = await Teacher.findByPk(id, { include: Course });
        if (!teacher) return render404(req, res);

        const courseCount = await teacher.countCourses();
        if (courseCount > 0) {
            return res.status(409).render('teachers/details', {
                title: teacher.name,
                teacher,
                error: 'Невозможно удалить преподавателя, у которого есть курсы'
            });
        }

        await teacher.destroy();
        res.redirect('/teachers');
    } catch (err) {
        // Защита на уровне базы данных (onDelete: RESTRICT)
        if (err instanceof ForeignKeyConstraintError) {
            return res.status(409).render('error', {
                title: 'Удаление невозможно',
                message: 'Невозможно удалить преподавателя, у которого есть курсы'
            });
        }
        next(err);
    }
};
