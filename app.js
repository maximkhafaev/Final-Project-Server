//Подключение библиотек
const express = require('express');
const app = express();

//Подключение роутеров
const available_testsRoutes = require('./routes/available_tests');
const questionsRoutes = require('./routes/questions');
const testsRoutes = require('./routes/tests');
const user_choicesRoutes = require('./routes/user_choices');
const usersRoutes = require('./routes/users');

//Вспомогательные функции
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//Обработка CORS-ошибок
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === 'OPTIONS') {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

//Роутеры
app.use('/available_tests', available_testsRoutes);
app.use('/questions', questionsRoutes);
app.use('/tests', testsRoutes);
app.use('/users', usersRoutes);
app.use('/user_choices', user_choicesRoutes);

//Обработка маршрутов без реализации
app.use((req, res, next) => {
    const error = new Error('Not found!');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json(error.message);
});

module.exports = app;