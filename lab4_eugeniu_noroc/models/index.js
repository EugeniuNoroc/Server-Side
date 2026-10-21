const sequelize = require('../config/database');
const Teacher = require('./Teacher');
const Course = require('./Course');

// Связь: Teacher 1 -> Many Courses
Teacher.hasMany(Course, {
    foreignKey: 'teacherId',
    onDelete: 'RESTRICT'
});

Course.belongsTo(Teacher, {
    foreignKey: 'teacherId'
});

// Начальные данные — добавляются только если таблицы пустые
async function seedIfEmpty() {
    const count = await Teacher.count();
    if (count > 0) return;

    const teachers = await Teacher.bulkCreate([
        { name: 'Ivan Ivanov', email: 'ivanov@example.com', department: 'Informatics', academicDegree: 'Doctor' },
        { name: 'Maria Popescu', email: 'popescu@example.com', department: 'Informatics', academicDegree: 'Master' },
        { name: 'Andrei Rusu', email: 'rusu@example.com', department: 'Software Engineering', academicDegree: 'Doctor' },
        { name: 'Elena Ciobanu', email: 'ciobanu@example.com', department: 'Computer Networks', academicDegree: 'Associate Professor' }
    ]);

    await Course.bulkCreate([
        { title: 'Server-side Programming', credits: 5, semester: 1, description: 'Development of server-side applications using Node.js', teacherId: teachers[0].id },
        { title: 'Object-Oriented Programming', credits: 5, semester: 2, description: 'Classes, objects, inheritance and polymorphism', teacherId: teachers[0].id },
        { title: 'Web Design', credits: 4, semester: 1, description: 'Basics of HTML, CSS and responsive design', teacherId: teachers[1].id },
        { title: 'Databases', credits: 6, semester: 2, description: 'Relational databases, SQL and data modeling', teacherId: teachers[2].id },
        { title: 'Node.js Frameworks', credits: 4, semester: 3, description: 'Express, Sequelize and building REST services', teacherId: teachers[0].id },
        { title: 'Computer Networks', credits: 4, semester: 3, description: 'Network models, TCP/IP protocols and routing', teacherId: teachers[3].id }
    ]);

    console.log('Начальные данные добавлены в базу');
}

module.exports = { sequelize, Teacher, Course, seedIfEmpty };
