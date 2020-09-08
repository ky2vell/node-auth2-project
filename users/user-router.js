const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('./users-model');
const { userAuth } = require('../middleware/userAuth');

const router = express.Router();

// @desc    Get all users
// @route   GET /api/users
// @access  Private
router.get('/users', userAuth(), async (req, res, next) => {
  try {
    const users = await Users.getUsers({ department: req.token.department });

    res.status(200).json({ count: users.length, data: users });
  } catch (err) {
    next(err);
  }
});

// @desc    Create user
// @route   POST /api/register
// @access  Public
router.post('/register', async (req, res, next) => {
  try {
    const { username, password, department } = req.body;
    const user = await Users.findUser({ username }).first();

    if (user) {
      return res.status(409).json({
        message: 'Username is already taken'
      });
    }

    const newUser = await Users.add({
      username,
      password: await bcrypt.hash(
        password,
        parseInt(process.env.TIME_COMPLEXITY)
      ),
      department
    });

    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
});

// @desc    Login user
// @route   POST /api/login
// @access  Public
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await Users.findUser({ username }).first();

    if (!user) {
      return res.status(401).json({
        message: 'User not found'
      });
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      return res.status(401).json({
        message: 'Invalid Credentials'
      });
    }

    // create JSON token for the user
    const token = jwt.sign(
      {
        id: user.id,
        department: user.department
      },
      process.env.TOKEN_SECRET
    );

    res.json({
      message: `Welcome ${user.username}!`,
      token
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
