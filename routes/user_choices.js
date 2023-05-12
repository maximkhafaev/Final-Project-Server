const express = require("express");
const router = express.Router();
const db = require('../dbService');
const validate = require('../validation/validationMiddleware');
const schema = require('../validation/validations');
const checkAuth = require('../authentification/check_authMiddleware');

router.post('/', checkAuth, validate.Body(schema.answer), (req, res, next) => {
    var answer = {
        userid: req.userData.id_user,
        questionid: req.body.questionID,
        user_choice: req.body.user_choice,
    };
    db.execute('SELECT EXISTS(SELECT * FROM user_choices WHERE id_user = ? AND id_question = ?) AS res', [answer.userid, answer.questionid], (err, results, fields) => {
        if (err) {
            res.status(500).json({
                error: err.message
            });
        } else {
            if (results[0].res == 1) {
                res.status(400).send('This record already exists!');
            } else {
                db.execute('SELECT options.Correct_option FROM options JOIN questions ON questions.id = options.id WHERE questions.id = ?', [answer.questionid], (err, results, fields) => {
                    if (err) {
                        res.status(500).json({
                            error: err.message
                        });
                    } else if (results.length == 0) {
                        res.status(500).json({
                            error: 'Query returned 0 records!'
                        });
                    } else {
                        const correct = results[0].Correct_option;
                        var isCorrect;
                        if (answer.user_choice == correct) {
                            isCorrect = 1;
                        } else {
                            isCorrect = 0;
                        };
                        db.execute('INSERT INTO `user_choices` (`id`, `id_user`, `id_question`, `User_choice`, `is_Correct`) VALUES (NULL, ?, ?, ?, ?);', [answer.userid, answer.questionid, answer.user_choice, isCorrect], (err, results, fields) => {
                            if (err) {
                                res.status(500).json({
                                    error: err.message
                                });
                           } else {
                                res.status(201);//.send(results);
                            };
                        });
                        db.unprepare('INSERT INTO `user_choices` (`id`, `id_user`, `id_question`, `User_choice`, `is_Correct`) VALUES (NULL, ?, ?, ?, NULL);');
                    };
                });
                db.unprepare('SELECT options.Correct_option FROM options JOIN questions ON questions.id = options.id WHERE questions.id = ?');
            };
        };
    });
    db.unprepare('SELECT EXISTS(SELECT * FROM user_choices WHERE id_user = ? AND id_question = ?) AS res');
});

module.exports = router;