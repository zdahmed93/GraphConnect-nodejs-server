const usersResolvers = require('./users')
const postsResolvers = require('./posts')
const commentsResolvers = require('./comments')


module.exports = {
    Query: {
        ...postsResolvers.Query
    },
    Mutation: {
        ...usersResolvers.Mutation,
        ...postsResolvers.Mutation,
        ...commentsResolvers.Mutation
    }
}