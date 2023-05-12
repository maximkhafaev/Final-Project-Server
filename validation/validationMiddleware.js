let validate = {};

validate.Body = (schema) => async (req, res, next) => {
    const body = req.body;
    try {
        await schema.validate(body);
        next();
    } catch (error) {
        return res.status(400).json({
            Invalid_input: error.errors
        });
    };
};

validate.Params = (schema) => async (req, res, next) => {
    const params = req.params;
    try {
        await schema.validate(params);
        next();
    } catch (error) {
        return res.status(400).json({
            Invalid_input: error.errors
        });
    };
};

module.exports = validate;