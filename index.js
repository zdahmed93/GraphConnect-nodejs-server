const {ApolloServer} = require('apollo-server')
const gql = require('graphql-tag')
const mongoose = require('mongoose')
const {importSchema} = require('graphql-import')

require('dotenv').config()

const Post = require('./models/Post')
const resolvers = require('./graphql/resolvers')


const server = new ApolloServer({
    typeDefs: importSchema('./graphql/schema.graphql'),
    resolvers
})

const port = process.env.PORT || 5000

mongoose.connect(
    process.env.MONGODB_URL, 
    { useNewUrlParser: true, useUnifiedTopology: true }
    ).then(() => {
        console.log('Server connected to the MongoDB database')
        return server.listen({port})
    }).then(res => {
        console.log(`Server is running on port ${res.url}`)
    }).catch(error => console.log({error}))
