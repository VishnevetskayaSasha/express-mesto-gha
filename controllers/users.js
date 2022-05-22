/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */

const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { getToken } = require('../middlewares/jwt');

const MONGO_DUBLICATE_ERROR_CODE = 11000;
const SOLT_ROUND = 10;

// Ошибки
const BadRequest = require('../error/BadRequest'); // 400
const Unauthorized = require('../error/Unauthorized '); // 401
const NotFound = require('../error/NotFound'); // 404
const ErrorConflict = require('../error/ErrorConflict'); // 409

// возвращает всех пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

// возвращает информацию о текущем пользователе
module.exports.getUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => res.send(user))
    .catch(next);
};

// возвращает пользователя по _id
module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.status(200).send(user);
      } else {
        throw new NotFound({ message: 'Пользователь не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequest('Проверьте введенные данные'));
      } else {
        next(err);
      }
    });
};

// создаёт пользователя (регистрация)
// eslint-disable-next-line consistent-return
module.exports.createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  if (!email || !password) {
    throw new BadRequest('Не введен email или пароль');
  }
  bcrypt.hash(password, SOLT_ROUND)
    .then((hash) => {
      User.create({
        email, password: hash, name, about, avatar,
      })
        .then((user) => {
          user = user.toObject();
          delete user.password;
          res.status(201).send(user);
        })
        .catch((err) => {
          if (err.code === MONGO_DUBLICATE_ERROR_CODE) {
            next(new ErrorConflict('Такой ользователь уже существует'));
          } else if (err.name === 'ValidatorError') {
            next(new BadRequest('Данные не валидны'));
          } else {
            next(err);
          }
        });
    });
};

// обновляет профиль
module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.status(200).send({ data: user });
      } else {
        throw new NotFound('Пользователь не найден');
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequest('Проверьте введенные данные'));
      } else {
        next(err);
      }
    });
};

// обновляет аватар
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.status(200).send({ data: user });
      } else {
        throw new NotFound('Пользователь не найден');
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequest('Проверьте введенные данные'));
      } else {
        next(err);
      }
    });
};

// получает из запроса почту и пароль и проверяет их
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequest('Не введен email или пароль');
  }

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new BadRequest('Не верный email или пароль');
      }
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new Unauthorized('Не верный email или пароль');
          }
          const token = getToken({ _id: user._id });
          res.cookie('jwt', token, {
            maxAge: 3600000,
            httpOnly: true,
            sameSite: true,
          });

          res.status(200).send({ jwt: token });
        })
        .catch(next);
    })
    .catch(next);
};
