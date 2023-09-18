const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const AuthError = require('../errors/AuthError');

const userSchema = new mongoose.Schema(
  {
    name: {
      minlength: 2,
      maxlength: 30,
      type: String,
      required: true,
    },
    email: {
      unique: true,
      type: String,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: 'Некорректный формат почты',
      },
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    toJSON: { useProjection: true },
  },
);

userSchema.statics.findByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError('Неверно введена почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthError('Неверно введена почта или пароль');
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);