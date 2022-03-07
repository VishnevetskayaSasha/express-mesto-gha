const User = require('../models/user');
const {
  ERROR_CODE, // 400
  ERROR_LACK, // 404
  ERROR_DEFAULT, // 500
} = require('../error/error');

// возвращает всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка', ...err }));
};

// возвращает пользователя по _id
module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.status(200).send(user);
      } else {
      // throw new Error({ message: 'Пользователь не найден' });
        res.status(ERROR_LACK).send({ message: 'Пользователь не найден' });
      }
    })
    .catch((err) => {
      if (err.user === 'CastError') {
        return res.status(ERROR_CODE).send({ message: 'Проверьте введенные данные' });
      }
      return res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка', ...err });
    });
};

// создаёт пользователя
module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({ message: 'Проверьте введенные данные' });
      }
      return res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка', ...err });
    });
};

// обновляет профиль
module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        return res.status(200).send({ data: user });
      }
      return res.status(ERROR_LACK).send({ message: 'Пользователь не найден' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(ERROR_CODE).send({ message: 'Проверьте введенные данные' });
      }
      return res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка', ...err });
    });
};

// обновляет аватар
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.status(200).send({ data: user });
      } else {
        res.status(ERROR_LACK).send({ message: 'Пользователь не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(ERROR_CODE).send({ message: 'Проверьте введенные данные' });
      }
      return res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка', ...err });
    });
};
