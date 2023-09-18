const movieRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getMovies, deleteMovie, createMovie
} = require('../controllers/movies');

movieRouter.get('/', getMovies);

movieRouter.delete('/:movieId', celebrate(
    {
      params: Joi.object().keys({
      movieId: Joi.string().length(24).hex(),}),
    }
  ), deleteMovie);

  movieRouter.post('/', createMovie);

  module.exports = movieRouter;