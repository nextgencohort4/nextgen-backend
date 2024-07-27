const Validators = require("../validators");
const ErrorObject = require("../utils/error");

module.exports = function (validator) {
  return async function (req, res, next) {
    try {
      const validated = await Validators[validator].validateAsync(req.body);

      req.body = validated;
      next();
    } catch (error) {
      if (error.isJoi) return next(new ErrorObject(error, 422));

      next(error);
    }
  };
};
