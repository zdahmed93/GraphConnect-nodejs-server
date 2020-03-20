const Post = require('../../models/Post')
const User = require('../../models/User')
const checkAuth = require('../../utilities/checkAuth')

module.exports = {
    Query: {
        async getPosts() {
            const posts = await Post.find()
            return posts
        }
    },
    Mutation: {
        async createPost(parent, args, {req}, info) {
            const user = checkAuth(req);
            const post = await new Post({
                body: args.body,
                username: user.username,
                createdAt: new Date().getTime().toString(),
                user: user.id
            }).save()
            user.password = undefined
            return post
        }
    }
}