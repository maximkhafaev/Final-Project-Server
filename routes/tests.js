const express = require("express");
const router = express.Router();
const db = require('../dbService');
const validate = require('../validation/validationMiddleware');
const schema = require('../validation/validations');
const checkAuth = require('../authentification/check_authMiddleware');

router.get('/isPassed/:testID', checkAuth, validate.Params(schema.testid), (req, res, next) => {
    const userid = req.userData.id_user;
    const testid = req.params.testID;
    db.execute('SELECT COUNT(user_choices.is_Correct) AS result FROM `user_choices` JOIN `questions` ON user_choices.id = questions.id WHERE id_user = ? AND questions.id_Test = ? AND user_choices.is_Correct = 1;', [userid, testid], (err, results, fields) => {
        if (err) {
            res.status(500).json({
                error: err.message
            });
        } else {
            var result = results[0].result;
            db.execute('SELECT Question_amount FROM tests WHERE id = ?;', [testid], (err, results, fields) => {
                if (err) {
                    res.status(500).json({
                        error: err.message
                    });
                } else {
                    var question_amount = results[0].Question_amount;
                    res.status(200).json({
                        user_result: result,
                        max_result: question_amount
                    });
                    db.execute('UPDATE `available_tests` SET `is_Finished` = 1, `Result` = ? WHERE `id_user` = ? AND `id_test` = ?;', [result, userid, testid], (err, results, fields) => {
                        if (err) {
                            res.status(500).json({
                                error: err.message
                        });                      
                    };});
                    db.unprepare('UPDATE `available_tests` SET `is_Finished` = 1, `Result` = ? WHERE `id_user` = ? AND `id_test` = ?;');
                };
            });
            db.unprepare('SELECT Question_amount FROM tests WHERE id = ?;');
        };
    });
    db.unprepare('SELECT COUNT(user_choices.is_Correct) AS result FROM `user_choices` JOIN `questions` ON user_choices.id = questions.id WHERE id_user = ? AND questions.id_Test = ? AND user_choices.is_Correct = 1;');
});

module.exports = router;