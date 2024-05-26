const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/userModel');
const { secret } = require('../config');
const transporter = require('../config/email');

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    user = new User({
      username,
      email,
      password,
      emailConfirmationToken: crypto.randomBytes(20).toString('hex')
    });

    await user.save();

    const confirmationUrl = `http://${req.headers.host}/api/auth/confirm-email?token=${user.emailConfirmationToken}`;

    await transporter.sendMail({
      to: email,
      subject: 'Email Confirmation',
      html: `<p>Please confirm your email by clicking the following link: <a href="${confirmationUrl}">${confirmationUrl}</a></p>`
    });

    res.json({ message: 'Registration successful, please check your email for confirmation' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.confirmEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ emailConfirmationToken: token });
    if (!user) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    user.emailConfirmed = true;
    user.emailConfirmationToken = '';
    await user.save();

    res.json({ message: 'Email confirmed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!user.emailConfirmed) {
      return res.status(400).json({ message: 'Please confirm your email first' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createAdmin = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    let newAdmin = await User.findOne({ email });
    if (newAdmin) {
      return res.status(400).json({ message: 'User already exists' });
    }

    newAdmin = new User({
      username,
      email,
      password,
      role: 'admin'
    });

    await newAdmin.save();

    res.json({ message: 'Admin created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
