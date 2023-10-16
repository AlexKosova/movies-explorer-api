const routes = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');
const NotFoundError = require('../errors/NotFoundError');
const userRouter = require('./users');
const movieRouter = require('./movies');
const auth = require('../middlewares/auth');
const { login, createUser, signout } = require('../controllers/users');

// routes.get('/crash-test', () => {
//   setTimeout(() => {
//     throw new Error('Сервер сейчас упадёт');
//   }, 0);
// });

routes.post('/signin', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2),
  }),
}), login);

routes.post('/signup', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

routes.post('/signout', signout);

routes.use(auth);

routes.use('/users', userRouter);
routes.use('/movies', movieRouter);

routes.use(() => {
  throw new NotFoundError('Страница не найдена');
});

module.exports = routes;