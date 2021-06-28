import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

export default hashPassword;
