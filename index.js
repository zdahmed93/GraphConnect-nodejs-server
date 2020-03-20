const {ApolloServer} = require('apollo-server')
const gql = require('graphql-tag')
const mongoose = require('mongoose')

require('dotenv').config()

const Post = require('./models/Post')


const typeDefs = gql`
    type Post {
        id:ID!
        body: String!
        createdAt: String!
        username: String!
    }
    type Query {
        getPosts: [Post!]!
    }
`

const resolvers = {
    Query: {
        async getPosts() {
            const posts = await Post.find()
            return posts
        }
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
