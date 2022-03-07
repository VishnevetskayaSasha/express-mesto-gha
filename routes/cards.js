const router = require('express').Router();
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards); // возвращает все карточки
router.post('/', createCard); // ссоздаёт карточку
router.delete('/:cardId', deleteCard); // удаляет карточку по идентификатору
router.put('/:cardId/likes', likeCard); // поставить лайк карточке
router.delete('/:cardId/likes', dislikeCard); // убрать лайк с карточки

module.exports = router;
