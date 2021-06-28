import express from 'express';
import authController from '../controllers/auth';
import signupValidate from '../middlewares/validations/signupValidation';
import signinValidate from '../middlewares/validations/signinValidation';

const router = express.Router();

const { signinValidator } = signinValidate;
const { signupValidator } = signupValidate;
const { signup, signin } = authController;

router.post('/signup', signupValidator, signup);
router.post('/signin', signinValidator, signin);

module.exports = router;
