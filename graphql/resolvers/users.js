const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {UserInputError} = require('apollo-server')
const {validateRegisterInput, validateLoginInput} = require('../../utilities/validators')


const User = require('../../models/User')

const generateToken = (user) => {
    const {id, username, email} = user
    return jwt.sign(
        {
            id,
            username,
            email
        },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: '1h'
        }
    )
}

const generateAuthPayload = (user, token) => {
    const {id, firstName, lastName, username, birthDate, email, createdAt} = user
    return {
        token,
        user: {
            id,
            firstName,
            lastName,
            username,
            birthDate,
            email,
            createdAt
        }
    }
}

module.exports = {
    Mutation: {
        async register(parent, args, context, info) {
            try {
                const {firstName, lastName, birthDate, username, email, password} = args.data;

                // Validate user inputs
                const {valid, errors} = validateRegisterInput({...args.data})
                if (!valid) {
                    return new UserInputError('Errors', {errors})
                }
                
                // Verify user doesn't already exist
                const usernameTaken = await User.findOne({username})
                if (usernameTaken) {
                    // Very useful when using apollo client on the frontend side
                    return new UserInputError('Username already taken', {
                        errors: {
                            username: 'This username is already taken'
                        }
                    })
                }
                const emailExists = await User.findOne({email})
                if (emailExists) {
                    return new UserInputError('Email already exists', {
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
                const token = generateToken(newUser)

                return generateAuthPayload(newUser, token)
            } catch (error) {
                console.log(error)
            }
        },
        async login(parent, args, context, info) {
            try {
                const {usernameOrEmail, password} = args.data
                const {valid, errors} = validateLoginInput(usernameOrEmail, password)
                if (!valid) {
                    return new UserInputError('Errors', {errors})
                }
                const user = await User.findOne({$or: [{username: usernameOrEmail}, {email: usernameOrEmail}]})
                if (!user) {
                    return new UserInputError('User not found', {
                        errors: {
                            usernameOrEmail: 'There is not a user with such email or username'
                        }
                    })
                }
                const passwordMatch = await bcrypt.compare(password, user.password)
                if (!passwordMatch) {
                    return new UserInputError('Wrong password', {
                        errors: {
                            password: 'Wrong password'
                        }
                    })
                }

                const token = generateToken(user)    
                return generateAuthPayload(user, token)

            } catch (error) {
                console.log(error)
            }

        } 
    }
}