const {ApolloServer} = require('apollo-server')
const gql = require('graphql-tag')
const mongoose = require('mongoose')
require('dotenv').config()


const typeDefs = gql`
    type Query {
        sayHello: String!
    }
`

const resolvers = {
    Query: {
        sayHello: () => 'Hello World!'
    }
}

const server = new ApolloServer({
    typeDefs,
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
