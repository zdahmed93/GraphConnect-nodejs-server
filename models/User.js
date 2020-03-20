const {Schema, model} = require('mongoose')

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    birthDate: String,
    username: String,
    password: String,
    email: String,
    createdAt: String
})

module.exports = model('User', userSchema)