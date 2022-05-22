const router = require('express').Router();
// импортируем роутеры
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const authRouter = require('./auth');
const auth = require('../middlewares/auth');
const NotFound = require('../error/NotFound'); // 404

// запускаем
router.use('/users', auth, usersRouter);
router.use('/cards', auth, cardsRouter);
router.use('/', authRouter);

router.use((req, res, next) => {
  next(new NotFound(`По адресу ${req.path} ничего нет`));
});

module.exports = router;
