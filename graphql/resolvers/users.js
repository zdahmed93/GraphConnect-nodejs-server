const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {UserInputError} = require('apollo-server')
const {validateRegisterInput, validateLoginInput} = require('../../utilities/validators')


const User = require('../../models/User')

module.exports = {
    Mutation: {
        async register(parent, args, context, info) {
            try {
                const {firstName, lastName, birthDate, username, email, password} = args.data;

                // Validate user inputs
                const {valid, errors} = validateRegisterInput({...args.data})
                if (!valid) {
                    throw new UserInputError('Errors', {errors})
                }
                
                // Verify user doesn't already exist
                const usernameTaken = await User.findOne({username})
                if (usernameTaken) {
                    // Very useful when using apollo client on the frontend side
                    throw new UserInputError('Username already taken', {
                        errors: {
                            username: 'This username is already taken'
                        }
                    })
                }
                const emailExists = await User.findOne({email})
                if (emailExists) {
                    throw new UserInputError('Email already exists', {
                        errors: {
                            email: 'This email already exists'
                        }
                    })
                }

                // hash the password
                const hashedPassword = await bcrypt.hash(password, 10)
                const newUser = await new User({
                    firstName,
                    lastName,
                    birthDate,
                    username,
                    email,
                    password: hashedPassword,
                    createdAt: new Date().getTime().toString()
                }).save()
                // generate a jwt
                const token = jwt.sign(
                    {
                        id: newUser.id,
                        username: newUser.username,
                        email: newUser.email
                    },
                    process.env.JWT_SECRET_KEY,
                    {
                        expiresIn: '1h'
                    }
                )

                return {
                    token,
                    user: {
                        id: newUser.id,
                        firstName: newUser.firstName,
                        lastName: newUser.lastName,
                        username: newUser.username,
                        birthDate: newUser.birthDate,
                        email: newUser.email,
                        createdAt: newUser.createdAt
                    }
                }
            } catch (error) {
                console.log(error.message)
                throw error;
            }
        }
    }
}