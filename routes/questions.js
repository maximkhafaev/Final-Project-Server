const express = require("express");
const router = express.Router();
const db = require('../dbService');
const validate = require('../validation/validationMiddleware');
const schema = require('../validation/validations');
const checkAuth = require('../authentification/check_authMiddleware');

router.get('/:testID', checkAuth, validate.Params(schema.testid), (req, res, next) => {
    const testid = req.params.testID;
    db.execute('SELECT Question_amount FROM `tests` WHERE id = ?', [testid], (err, results, fields) => {
        if (err) {
            res.status(500).json({
                error: err.message
        }); return; } else {
            const num = results[0].Question_amount;
            db.execute('SELECT questions.id, questions.Question, options.Option_a, options.Option_b, options.Option_c FROM `questions`, `options` WHERE questions.id_TEST = ? AND questions.id = options.id ORDER BY RAND() LIMIT ?', [testid, num], (err, results, fields) => {
                if (err) {
                    res.status(500).json({
                        error: err.message
                });} else {
                    res.status(200).send(results)
                } 
            });
            db.unprepare('SELECT questions.id, questions.Question, options.Option_a, options.Option_b, options.Option_c FROM `questions`, `options` WHERE questions.id_TEST = ? AND questions.id = options.id ORDER BY RAND() LIMIT ?');
        }
    });
    db.unprepare('SELECT Question_amount FROM `tests` WHERE id = ?');
});

module.exports = router;