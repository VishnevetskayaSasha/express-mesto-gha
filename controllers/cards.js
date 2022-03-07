const Card = require('../models/card');
const {
  ERROR_CODE, // 400
  ERROR_LACK, // 404
  ERROR_DEFAULT, // 500
} = require('../error/error');

// возвращает все карточки
module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка', ...err }));
};

// ссоздаёт карточку
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;

  Card.create({ name, link, owner: ownerId })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE).send({ message: 'Проверьте введенные данные' });
      }
      return res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка', ...err });
    });
};

// удаляет карточку по идентификатору
module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card) {
        res.status(200).send(card);
      } else {
        res.status(ERROR_LACK).send({ message: 'Пользователь не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE).send({ message: 'Проверьте введенные данные' });
      }
      return res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка', ...err });
    });
};

// поставить лайк карточке
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.status(200).send(card);
      } else {
        res.status(ERROR_LACK).send({ message: 'Пользователь не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE).send({ message: 'Проверьте введенные данные' });
      }
      return res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка', ...err });
    });
};

// убрать лайк с карточки
module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.status(200).send(card);
      } else {
        res.status(ERROR_LACK).send({ message: 'Пользователь не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE).send({ message: 'Проверьте введенные данные' });
      }
      return res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка', ...err });
    });
};
