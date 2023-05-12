require('dotenv').config();
const express = require("express");
const router = express.Router();
const db = require('../dbService');
const validate = require('../validation/validationMiddleware');
const schema = require('../validation/validations');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('../authentification/check_authMiddleware');

router.get('/', checkAuth, (req, res, next) => {
    const userid = req.userData.id_user;
    db.execute('SELECT `FIO`, `Info` FROM `users` WHERE `id` = ?', [userid], (err, results, fields) => {
        if (err) {
            res.status(500).json({
                error: err.message
        });} else {
            res.status(200).send(results[0]);
        };
        });
    db.unprepare('SELECT `FIO`, `Info` FROM `users` WHERE `id` = ?');
});

router.post('/signup', checkAuth, validate.Body(schema.signup), (req, res, next) => {
    const username = req.body.username;
    const isAdmin = req.body.isAdmin;
    const info = req.body.info;
    if (req.userData.isAdmin == 0) {
        return res.status(403).json({
            error: 'Access denied for your user role!'
    });};
    db.execute('SELECT EXISTS(SELECT * FROM users WHERE Username = ?) AS res;', [username], (err, results, fields) => {
        if (err) {
            res.status(500).json({
                error: err.message
            });
        } else {
            if (results[0].res == 1) {
                res.status(409).json({
                    error: 'User with this username already exists!'
            });} else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        db.execute('INSERT INTO `users` (`id`, `Username`, `Password`, `is_Admin`, `Info`) VALUES (NULL, ?, ?, ?, ?);', [username, hash, isAdmin, info], (err, results, fields) => {
                            if (err) {
                                res.status(500).json({
                                    error: err.message
                                });
                            } else {
                                res.status(201);//.send(results);
                            };
                        });
                        db.unprepare('INSERT INTO `users` (`id`, `Username`, `Password`, `is_Admin`, `Info`) VALUES (NULL, ?, ?, ?, ?);');
                    };
                });
            };
        };
    });
    db.unprepare('SELECT EXISTS(SELECT * FROM users WHERE Username = ?) AS res;');
});

router.post('/login', validate.Body(schema.login), (req, res, next) => {
    const username = req.body.username;
    db.execute('SELECT EXISTS(SELECT * FROM users WHERE Username = ?) AS res;', [username], (err, results, fields) => {
        if (err) {
            res.status(500).json({
                error: err.message
            });
        } else {
            if (results[0].res == 0) {
                res.status(401).json({
                    "error": "Неверный логин и/или пароль!"
            });} else {
                db.execute('SELECT `id`, `Password`, `is_Admin` FROM users WHERE Username = ?;', [username], (err, results, fields) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const hashedpassword = results[0].Password;
                        bcrypt.compare(req.body.password, hashedpassword, (err, result) => {
                            if (err) {
                                res.status(401).json({
                                    error: "Ошибка!"
                                });
                            } else if (result) {
                                const accessToken = jwt.sign({
                                    username: username,
                                    id_user: results[0].id,
                                    isAdmin: results[0].is_Admin
                                }, process.env.JWT_SECRET);
                                res.status(200).json({
                                    "token": accessToken
                                });
                            } else {
                                res.status(401).json({
                                    error: "Неверный логин и/или пароль!"
                                });
                            };
                        });
                    };
                });
                db.unprepare('SELECT `id`, `Password`, `is_Admin` FROM users WHERE Username = ?;');
            };
        };
    });
    db.unprepare('SELECT EXISTS(SELECT * FROM users WHERE Username = ?) AS res;');
});

module.exports = router;