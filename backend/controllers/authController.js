const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc Get a session by ID
// @route GET /api/session/:id
// @access Private


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
}

// @desc Register a new user
// @route POST /api/auth/register  
// @access Public

const registerUser = async (req, res) => {
    try{
        const { name, email, password,profileImageUrl } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            profileImageUrl
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id),
        });
    }catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// @desc Login a user
// @route POST /api/auth/login
// @access Public

const loginUser = async (req, res) => {
  try{
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id),
        });
  }catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

// @desc Get user profile
// @route GET /api/auth/profile 
// @access Private

const getUserProfile = async (req, res) => {
  try{
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  }catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};