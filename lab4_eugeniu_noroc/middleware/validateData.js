const { Op } = require('sequelize');
const { Teacher, Course } = require('../models');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Проверка ID из URL: только целое положительное число
function parseId(value) {
    return /^\d+$/.test(String(value)) && Number(value) > 0 ? Number(value) : null;
}

function render404(req, res) {
    return res.status(404).render('404', { title: '404 Not Found', url: req.originalUrl });
}

// ===== Преподаватель =====
async function validateTeacher(req, res, next) {
    try {
        const name = (req.body.name || '').trim();
        const email = (req.body.email || '').trim().toLowerCase();
        const department = (req.body.department || '').trim();
        const academicDegree = (req.body.academicDegree || '').trim();
        const errors = [];

        // Для редактирования: проверяем, что преподаватель существует
        let currentId = null;
        if (req.params.id !== undefined) {
            currentId = parseId(req.params.id);
            if (!currentId || !(await Teacher.findByPk(currentId))) return render404(req, res);
        }

        if (!name) errors.push('Имя преподавателя обязательно');

        if (!email) {
            errors.push('Email обязателен');
        } else if (!EMAIL_REGEX.test(email)) {
            errors.push('Email имеет некорректный формат');
        } else {
            const where = { email };
            if (currentId) where.id = { [Op.ne]: currentId };
            const duplicate = await Teacher.findOne({ where });
            if (duplicate) errors.push('Преподаватель с таким email уже существует');
        }

        if (!department) errors.push('Кафедра обязательна');
        if (!academicDegree) errors.push('Учёная степень обязательна');

        const teacher = { name, email, department, academicDegree };

        if (errors.length > 0) {
            if (currentId) {
                return res.status(400).render('teachers/edit', {
                    title: 'Редактировать преподавателя',
                    errors,
                    teacher: { id: currentId, ...teacher }
                });
            }
            return res.status(400).render('teachers/create', {
                title: 'Добавить преподавателя',
                errors,
                teacher
            });
        }

        req.validData = teacher;
        next();
    } catch (err) {
        next(err);
    }
}

// ===== Курс =====
async function validateCourse(req, res, next) {
    try {
        const title = (req.body.title || '').trim();
        const description = (req.body.description || '').trim();
        const creditsRaw = String(req.body.credits ?? '').trim();
        const semesterRaw = String(req.body.semester ?? '').trim();
        const teacherIdRaw = String(req.body.teacherId ?? '').trim();
        const errors = [];

        let currentId = null;
        if (req.params.id !== undefined) {
            currentId = parseId(req.params.id);
            if (!currentId || !(await Course.findByPk(currentId))) return render404(req, res);
        }

        if (!title) errors.push('Название дисциплины обязательно');

        const credits = Number(creditsRaw);
        if (!creditsRaw || !Number.isInteger(credits) || credits <= 0) {
            errors.push('Количество кредитов должно быть положительным целым числом');
        }

        const semester = Number(semesterRaw);
        if (!semesterRaw || !Number.isInteger(semester) || semester < 1 || semester > 8) {
            errors.push('Семестр должен находиться в диапазоне от 1 до 8');
        }

        if (!description) errors.push('Описание дисциплины обязательно');

        const teacherId = parseId(teacherIdRaw);
        if (!teacherIdRaw) {
            errors.push('Выберите преподавателя');
        } else if (!teacherId || !(await Teacher.findByPk(teacherId))) {
            errors.push('Выбранный преподаватель не существует');
        }

        if (errors.length > 0) {
            const teachers = await Teacher.findAll({ order: [['name', 'ASC']] });
            const course = {
                id: currentId,
                title,
                credits: creditsRaw,
                semester: semesterRaw,
                description,
                teacherId: teacherIdRaw
            };
            const view = currentId ? 'courses/edit' : 'courses/create';
            return res.status(400).render(view, {
                title: currentId ? 'Редактировать курс' : 'Добавить курс',
                errors,
                course,
                teachers
            });
        }

        req.validData = { title, credits, semester, description, teacherId };
        next();
    } catch (err) {
        next(err);
    }
}

module.exports = { validateTeacher, validateCourse, parseId };
