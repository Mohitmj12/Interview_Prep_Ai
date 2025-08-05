const Session = require('../models/Session');
const Question = require('../models/Question');


// @desc Create a new session
// @route POST /api/session/create
// @access Private


exports.createSession = async (req, res) => {
    try{
        const {role,experience,topicsToFocus,description,questions} = req.body;
        const userId = req.user._id;

        const session = new Session({
            user: userId,
            role,
            experience,
            topicsToFocus,
            description,
        });

        const questionDocs = await Promise.all(
            questions.map(async (q) => {
                const question = await Question.create({
                    session: session._id,
                    question: q.question,
                    answer: q.answer,
                })
                return question._id;
            })
        );
        session.questions = questionDocs;
        await session.save();
        res.status(201).json({
            message: 'Session created successfully',
            session
        });
    }catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// @desc Get all sessions of the logged-in user
// @route GET /api/session/my-sessions  
// @access Private


exports.getMySessions = async (req, res) => {

    try{
        const sessions = await Session.find({ user: req.user._id })
            .populate('questions')
            .sort({ createdAt: -1 });
        res.status(200).json({
            message: 'User sessions fetched successfully',
            sessions
        });
    }catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// @desc Get a session by ID
// @route GET /api/session/:id
// @access Private

exports.getSessionById = async (req, res) => {
    try{
        const session = await Session.findById(req.params.id)
            .populate({
                path: 'questions',
                options: { sort: { createdAt: -1,isPinned: -1 } }
            })
        
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        res.status(200).json({
            message: 'Session fetched successfully',
            session
        });
    }catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// @desc Delete a session by ID
// @route DELETE /api/session/:id
// @access Private

exports.deleteSession = async (req, res) => {
    try{
        const session = await Session.findById(req.params.id);

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        // Delete associated questions
        await Question.deleteMany({ session: session._id });

        // Delete the session
        await session.deleteOne();

        res.status(200).json({
            message: 'Session deleted successfully',
        });
    }catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}