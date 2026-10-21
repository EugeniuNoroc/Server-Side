const { fn, col, literal } = require('sequelize');
const { Teacher, Course } = require('../models');

// GET /statistics — все данные считаются в PostgreSQL
exports.getStatistics = async (req, res, next) => {
    try {
        const teacherCount = await Teacher.count();
        const courseCount = await Course.count();

        // Количество курсов в каждом семестре
        const bySemester = await Course.findAll({
            attributes: ['semester', [fn('COUNT', col('id')), 'count']],
            group: ['semester'],
            order: [['semester', 'ASC']],
            raw: true
        });

        // Количество курсов у каждого преподавателя
        const byTeacherRaw = await Teacher.findAll({
            attributes: ['id', 'name', [fn('COUNT', col('Courses.id')), 'courseCount']],
            include: [{ model: Course, attributes: [] }],
            group: ['Teacher.id'],
            order: [[literal('"courseCount"'), 'DESC'], ['name', 'ASC']],
            raw: true
        });

        const byTeacher = byTeacherRaw.map(t => ({
            id: t.id,
            name: t.name,
            courseCount: Number(t.courseCount)
        }));

        // Преподаватель(и) с наибольшим количеством курсов
        const maxCount = byTeacher.length ? byTeacher[0].courseCount : 0;
        const topTeachers = maxCount > 0 ? byTeacher.filter(t => t.courseCount === maxCount) : [];

        res.render('statistics', {
            title: 'Статистика',
            teacherCount,
            courseCount,
            bySemester: bySemester.map(s => ({ semester: s.semester, count: Number(s.count) })),
            byTeacher,
            topTeachers,
            maxCount
        });
    } catch (err) {
        next(err);
    }
};
