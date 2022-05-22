const mongoose = require('mongoose');
const validator = require('validator');
const isEmail = require('validator/lib/isEmail');

// Опишем схему:
const userSchema = new mongoose.Schema({
  name: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
    default: 'Жак-Ив Кусто', // задаем дефолтное значение
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'Введена некорректная ссылка. Пожалуйста, укажите другую ссылку',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    validate: {
      validator: (email) => isEmail(email),
      message: 'Введен некорректный email. Пожалуйста, укажите другой email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});
// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);
