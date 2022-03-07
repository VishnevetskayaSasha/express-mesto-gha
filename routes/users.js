// const express = require('express');
const router = require('express').Router();
const {
  getUsers, getUserById, createUser, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers); // возвращает всех пользователей
router.get('/:userId', getUserById); // возвращает пользователя по _id
router.post('/', createUser); // создаёт пользователя
router.patch('/me', updateUser); // обновляет профиль
router.patch('/me/avatar', updateAvatar); // обновляет аватар

module.exports = router;
