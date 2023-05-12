const yup = require('yup'); 
let schema = {};

schema.testid = yup.object({
    testID: yup.number().integer().positive().required()
});

schema.answer = yup.object({
    questionID: yup.number().integer().positive().required(),
    user_choice: yup.string().min(1).nullable(true).strict()
})

schema.signup = yup.object({
    username: yup.string().min(1).max(100).required().strict(),
    password: yup.string().min(1).max(100).required().strict(),
    isAdmin: yup.boolean().required(),
    info: yup.string().min(1).max(100).required().strict()
})

schema.login = yup.object({
    username: yup.string().min(1).max(100).required().strict(),
    password: yup.string().min(1).max(100).required().strict()
})

module.exports = schema;