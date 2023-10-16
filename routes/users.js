const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers, updateProfile, getUser,
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/me', getUser);

userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateProfile);


module.exports = userRouter;