const express = require('express');
const router = express.Router();

const courseController = require('../controllers/courseController');
const { validateCourse } = require('../middleware/validateData');

router.get('/', courseController.getAllCourses);
router.get('/new', courseController.showCreateForm);
router.post('/', validateCourse, courseController.createCourse);
router.get('/:id', courseController.getCourseById);
router.get('/:id/edit', courseController.showEditForm);
router.post('/:id/edit', validateCourse, courseController.updateCourse);
router.post('/:id/delete', courseController.deleteCourse);

module.exports = router;
