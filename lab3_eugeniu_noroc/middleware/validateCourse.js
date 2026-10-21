const Course = require('../models/courseModel');

function validateCourse(req, res, next) {
    const { title, teacher, credits, semester, description } = req.body;
    const errors = [];

    if (!title || !title.trim()) {
        errors.push('Название дисциплины обязательно');
    }

    if (!teacher || !teacher.trim()) {
        errors.push('Имя преподавателя обязательно');
    }

    const creditsNum = Number(credits);
    if (credits === undefined || String(credits).trim() === '' || isNaN(creditsNum) || creditsNum <= 0) {
        errors.push('Количество кредитов должно быть положительным числом');
    }

    const semesterNum = Number(semester);
    if (semester === undefined || String(semester).trim() === '' || !Number.isInteger(semesterNum)) {
        errors.push('Семестр должен быть целым числом');
    } else if (semesterNum < 1 || semesterNum > 8) {
        errors.push('Семестр должен находиться в диапазоне от 1 до 8');
    }

    if (!description || !description.trim()) {
        errors.push('Описание дисциплины обязательно');
    }

    if (errors.length === 0) {
        return next();
    }

    // Данные формы сохраняются, чтобы пользователь их не потерял
    const formData = {
        title: title || '',
        teacher: teacher || '',
        credits: credits || '',
        semester: semester || '',
        description: description || ''
    };

    // Редактирование: /courses/:id/edit
    if (req.params.id) {
        const existing = Course.getById(req.params.id);
        if (!existing) {
            return res.status(404).render('404', {
                title: '404 Not Found',
                url: req.originalUrl
            });
        }
        return res.status(400).render('courses/edit', {
            title: 'Редактировать курс',
            errors,
            course: { id: existing.id, ...formData }
        });
    }

    // Добавление: /courses
    return res.status(400).render('courses/create', {
        title: 'Добавить курс',
        errors,
        course: formData
    });
}

module.exports = validateCourse;
