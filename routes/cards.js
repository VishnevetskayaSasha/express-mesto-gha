const router = require('express').Router();
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const {
  validatyCard,
  validatyCardId,
} = require('../middlewares/validation');

router.get('/', getCards); // возвращает все карточки
router.post('/', validatyCard, createCard); // ссоздаёт карточку
router.delete('/:cardId', validatyCardId, deleteCard); // удаляет карточку по идентификатору
router.put('/:cardId/likes', validatyCardId, likeCard); // поставить лайк карточке
router.delete('/:cardId/likes', validatyCardId, dislikeCard); // убрать лайк с карточки

module.exports = router;
