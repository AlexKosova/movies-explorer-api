const bcrypt = require('bcryptjs');

const { NODE_ENV, JWT_KEY } = process.env;
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const RegisterError = require('../errors/RegisterError');
const NotFoundError = require('../errors/NotFoundError');
const InvalidError = require('../errors/InvalidError');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then(
      (hash) => User.create({
        name,
        email,
        password: hash,
      }),
    )
    .then((user) => res.send(user.toJSON()))
    .catch((err) => {
      console.log(err);
      if (err.code === 11000) {
        return next(new RegisterError('Пользователь уже существует'));
      }
      if (err.name === 'ValidationError') {
        return next(new InvalidError('Введены некорректные данные'));
      } next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_KEY : 'secret-11', {
        expiresIn: '7d',
      });
      res.cookie('jwt', token);
      res.send({ 
        jwt: token,
        user: user,
      });
    })
    .catch(next);
};

const signout = (req, res, next) => {
  res.clearCookie('jwt').json( { message: "Вы вышли из учётной записи"})
  .catch(next);
}

const getUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь не найден'));
      }
      return res.send(user);
    })
    .catch(next);
};

const updateProfile = (req, res, next) => {
  const { _id } = req.user;
  const data = {
    name: req.body.name,
    email: req.body.email,
  };
  User.findByIdAndUpdate(_id, data, { new: true, runValidators: true })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new InvalidError('Введены некорректные данные'));
      }
      return next(err);
    });
};

module.exports = {
  getUsers,
  createUser,
  updateProfile,
  login,
  getUser,
  signout,
};
