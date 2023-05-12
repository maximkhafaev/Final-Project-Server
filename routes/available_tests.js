const express = require("express");
const router = express.Router();
const db = require('../dbService');
const checkAuth = require('../authentification/check_authMiddleware');

router.get('/', checkAuth, (req, res, next) => {
    const userid = req.userData.id_user;
    db.execute('SELECT available_tests.id_Test AS `id_test`, tests.Name AS `name`, available_tests.is_Finished AS `is_finished`, available_tests.Result AS `result`, tests.Question_amount AS `max_res`, tests.Required_result AS `req_res` FROM `available_tests` JOIN `tests` ON available_tests.id_Test = tests.id WHERE `id_USER` = ?', [userid], (err, results, fields) => {
        if (err) {
            res.status(500).json({
                error: err.message
        });} else {
            res.status(200).send(results)
        } 
    });
    db.unprepare('SELECT available_tests.id_Test AS `id_test`, tests.Name AS `name`, available_tests.is_Finished AS `is_finished`, available_tests.Result AS `result`, tests.Question_amount AS `max_res`, tests.Required_result AS `req_res` FROM `available_tests` JOIN `tests` ON available_tests.id_Test = tests.id WHERE `id_USER` = ?');
});

module.exports = router;