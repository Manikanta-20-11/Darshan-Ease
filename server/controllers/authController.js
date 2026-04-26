const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, adminSecret } = req.body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ message: 'Invalid email format' });
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // Admin registration requires a secret key
    if (role === 'admin') {
      if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
        return res.status(403).json({ message: 'Invalid Admin Secret Key' });
      }
    }

    const user = await User.create({ name, email, password, role: role === 'admin' ? 'admin' : 'user' });

    if (user) {
      // Send welcome email (non-blocking)
      const welcomeHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #FDBA74; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(90deg, #EA580C, #D97706); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">🛕 Darshan Ease</h1>
            <p style="color: #FEF3C7;">Welcome to the Family!</p>
          </div>
          <div style="padding: 30px; background: #FFFDF5;">
            <p>Namaste <strong>${name}</strong>,</p>
            <p>Your account has been created successfully. Start booking your darshan slots and experience a seamless pilgrimage!</p>
            <p>🙏 Jai Mata Di<br/><strong>Team Darshan Ease</strong></p>
          </div>
        </div>
      `;
      sendEmail(email, 'Welcome to Darshan Ease 🛕', welcomeHtml);

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Protected
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name = req.body.name || user.name;
    if (req.body.password) {
      if (req.body.password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
      user.password = req.body.password; // Model pre-save hook will hash it
    }

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, updateUserProfile };
