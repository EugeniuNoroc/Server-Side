const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Course = sequelize.define('Course', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Название дисциплины обязательно' }
        }
    },
    credits: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: { msg: 'Количество кредитов должно быть целым числом' },
            min: { args: [1], msg: 'Количество кредитов должно быть положительным числом' }
        }
    },
    semester: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: { msg: 'Семестр должен быть целым числом' },
            min: { args: [1], msg: 'Семестр должен находиться в диапазоне от 1 до 8' },
            max: { args: [8], msg: 'Семестр должен находиться в диапазоне от 1 до 8' }
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Описание дисциплины обязательно' }
        }
    },
    teacherId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

module.exports = Course;
