const express = require('express');
const { addQuestionToSession, togglePinQuestion, updateQuestionNotes } = require('../controllers/questionController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/add', protect, addQuestionToSession);
router.post('/:id/pin', protect, togglePinQuestion);
router.post('/:id/notes', protect, updateQuestionNotes);

module.exports = router;