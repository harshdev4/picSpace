const validator = require('validator');

const validateUser = (email, password, fullName) => {
  if (!validator.isEmail(email)) {
    throw new Error("Invalid email.");
  }

  if (!validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1})) {
    throw new Error("Password must be at least 8 characters long and alphanumeric.");
  }

  if (!/^[A-Za-z\s]+$/.test(fullName)) {
    throw new Error("Full name must contain only letters and spaces.");
  }

  return true;
};

module.exports = validateUser;
