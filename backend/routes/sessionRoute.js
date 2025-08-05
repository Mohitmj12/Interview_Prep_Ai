const express = require('express');
const {protect} = require('../middlewares/authMiddleware');
const router = express.Router();
const { getSessionById,getMySessions, createSession, deleteSession } = require('../controllers/sessionController');

router.post('/create', protect, createSession);
router.get('/my-sessions', protect, getMySessions);
router.get('/:id', protect, getSessionById);
router.delete('/:id', protect, deleteSession);

module.exports = router;