const Card = require('../models/card');

// Ошибки
const BadRequest = require('../error/BadRequest'); // 400
const NotFound = require('../error/NotFound'); // 404
const Forbidden = require('../error/Forbidden'); // 403

// возвращает все карточки
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

// ссоздаёт карточку
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;

  Card.create({ name, link, owner: ownerId })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Проверьте введенные данные'));
      } else {
        next(err);
      }
    });
};

// удаляет карточку по идентификатору
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => new NotFound('Карточка не найдена'))
    .then((card) => {
      if (card.owner._id.toString() === req.user._id) {
        return card.remove()
          .then(() => res.send({ message: 'Карточка удалена' }));
      }
      return next(new Forbidden('У вас нет прав для удаления этой карточки'));
    })

    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

// поставить лайк карточке
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.status(200).send(card);
      } else {
        throw new NotFound('Карточка не найдена');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Проверьте введенные данные'));
      } else {
        next(err);
      }
    });
};

// убрать лайк с карточки
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.status(200).send(card);
      } else {
        throw new NotFound('Карточка не найдена');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Проверьте введенные данные'));
      } else {
        next(err);
      }
    });
};
