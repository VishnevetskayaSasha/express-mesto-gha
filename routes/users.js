const router = require('express').Router();
const {
  getUsers, getUser, getUserById, updateUser, updateAvatar,
} = require('../controllers/users');
const {
  validatyUser,
  validatyAvatar,
  validatyUserId,
} = require('../middlewares/validation');

router.get('/', getUsers); // возвращает всех пользователей
router.get('/me', getUser); // возвращает информацию о текущем пользователе
router.get('/:userId', validatyUserId, getUserById); // возвращает пользователя по _id
router.patch('/me', validatyUser, updateUser); // обновляет профиль
router.patch('/me/avatar', validatyAvatar, updateAvatar); // обновляет аватар

module.exports = router;
