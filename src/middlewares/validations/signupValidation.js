const signUpValidate = {
    signupValidator: (req, res, next) => {
      req.check('email', 'fill in email field').notEmpty();
      req.check('email').isLength({ min: 4, max: 150 }).withMessage('email must contain between 4 - 150 characters');
      req.check('email').matches(/.+@.+/).withMessage('email must contain an @ symbol');
      req.check('password').isLength({ min: 6 }).withMessage('password must contain at least 6 characters');
      req.check('password').matches(/\d/).withMessage('password must contain digit character');
      const errors = req.validationErrors();
      if (errors) {
        const firstError = errors.map((err) => err.msg)[0];
        return res.status(422).json({ error: firstError });
      }
      next();
    },
  };
  export default signUpValidate;
  