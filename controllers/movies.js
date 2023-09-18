const Movie = require('../models/movie');
const InvalidError = require('../errors/InvalidError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenErr = require('../errors/ForbiddenErr');

const createMovie = (req, res, next) => {
  const newMovie = {
    coutry: req.body.coutry,
    director: req.body.director,
    duration: req.body.duration,
    year: req.body.year,
    description: req.body.description,
    image: req.body.image,
    trailerLink: req.body.trailerLink,
    nameRU: req.body.nameRU,
    nameEN: req.body.nameEN,
    thubnail: req.body.thubnail,
    movieId: req.body.movieId,
    owner: req.user._id,
  };
  Movie.create(newMovie)
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new InvalidError('Введены неверные данные'));
      } next(err);
    });
};

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  const { _id } = req.user;
  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        return next(new NotFoundError('Данные не найдены'));
      }
      if (_id === movie.owner.toString()) {
        return movie.deleteOne()
          .then(() => res.send(movie));
      } return next(new ForbiddenErr('У вас нет прав для удаления'));
    })
    .catch(next);
};

module.exports = {
  createMovie,
  getMovies,
  deleteMovie,
};