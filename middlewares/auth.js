/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const Unauthorized = require('../error/Unauthorized '); // 401
const Forbidden = require('../error/Forbidden'); // 403

module.exports = (req, res, next) => {
  // const token = req.headers.authorization; // токен из заголовка
  const token = req.cookies.jwt; // токен из куки
  if (!token) {
    throw new Unauthorized('Необходимо авторизоваться');
  }
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new Forbidden('Нет доступа'));
  }
  req.user = payload;
  next();
};
