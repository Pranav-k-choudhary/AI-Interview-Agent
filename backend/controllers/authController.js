import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Helper to sign JWT and set cookie
const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Set first user in database as admin for testing convenience
    const totalUsersCount = await User.count();
    const role = totalUsersCount === 0 ? 'admin' : 'user';

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    if (user) {
      generateToken(res, user.id);
      return res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        targetRole: user.targetRole,
        experienceLevel: user.experienceLevel,
        skills: user.skills,
      });
    } else {
      return res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & set token cookie
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (user && (await user.matchPassword(password))) {
      generateToken(res, user.id);
      return res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        targetRole: user.targetRole,
        experienceLevel: user.experienceLevel,
        skills: user.skills,
      });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Protected
export const logoutUser = async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  return res.json({ message: 'Logged out successfully' });
};

// @desc    Get user profile details
// @route   GET /api/auth/profile
// @access  Protected
export const getUserProfile = async (req, res) => {
  if (req.user) {
    return res.json({
      _id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      targetRole: req.user.targetRole,
      experienceLevel: req.user.experienceLevel,
      skills: req.user.skills,
    });
  } else {
    return res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Update user profile details
// @route   PUT /api/auth/profile
// @access  Protected
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.targetRole = req.body.targetRole !== undefined ? req.body.targetRole : user.targetRole;
      user.experienceLevel = req.body.experienceLevel !== undefined ? req.body.experienceLevel : user.experienceLevel;
      user.skills = req.body.skills !== undefined ? req.body.skills : user.skills;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      return res.json({
        _id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        targetRole: updatedUser.targetRole,
        experienceLevel: updatedUser.experienceLevel,
        skills: updatedUser.skills,
      });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Reset password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }

    user.password = newPassword;
    await user.save();

    return res.json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ message: error.message });
  }
};
