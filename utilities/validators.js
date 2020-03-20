
const validateRegisterInput = ({
    username,
    email,
    password,
    firstName,
    lastName
}) => {
    const errors = {};
    if (username.trim() === '') {
      errors.username = 'Username must be not empty';
    }
    if (email.trim() === '') {
      errors.email = 'Email must be not empty';
    } else {
      const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
      if (!email.match(regEx)) {
        errors.email = 'Email must be a valid email address';
      }
    }
    if (password === '') {
      errors.password = 'Password must not empty';
    }
    if (!firstName) {
        errors.firstName = 'First name must be not empty';
    }
    if (!lastName) {
        errors.lastName = 'Last name must be not empty';
    }
  
    return {
      errors,
      valid: Object.keys(errors).length < 1
    };
  };
  
  const validateLoginInput = (usernameOrEmail, password) => {
    const errors = {};
    if (usernameOrEmail.trim() === '') {
      errors.usernameOrEmail = 'You must provide an email or a username';
    }
    if (password.trim() === '') {
      errors.password = 'Password must be not empty';
    }
  
    return {
      errors,
      valid: Object.keys(errors).length < 1
    };
  };

module.exports = {
    validateRegisterInput,
    validateLoginInput
}