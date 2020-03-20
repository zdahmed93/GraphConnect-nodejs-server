const jwt = require('jsonwebtoken')
const {AuthenticationError} = require('apollo-server')

module.exports = (request) => {
    const headers = request.headers.authorization
    if (!headers) {
        throw new Error('Authentication header must be provided')
    }
    const token = headers.split('Bearer ')[1]
    if (!token) {
        throw new Error('Authorization token must be \'Bearer [token]\'')
    }
    try {
        const user = jwt.verify(token, process.env.JWT_SECRET_KEY)
        return user;
    } catch (error) {
        console.log(error.message)
        throw new AuthenticationError('Invalid/Expired token')
    }
}