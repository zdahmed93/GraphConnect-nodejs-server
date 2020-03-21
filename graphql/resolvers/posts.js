const {AuthenticationError} = require('apollo-server')

const Post = require('../../models/Post')
const User = require('../../models/User')
const checkAuth = require('../../utilities/checkAuth')

module.exports = {
    Query: {
        async posts() {
            const posts = await Post.find().sort({createdAt: -1})
            return posts
        },
        async post(parent, args, context, info) {
            try {
                const post = await Post.findById(args.id)
                if (post) {
                    return post
                } else {
                    return new Error('Post not found')
                }
            } catch (error) {
                console.log(error)
            }
        }
    },
    Mutation: {
        async createPost(parent, args, {req, pubsub}, info) {
            const user = checkAuth(req);
            try {
                const post = await new Post({
                    body: args.body,
                    username: user.username,
                    createdAt: new Date().getTime().toString(),
                    user: user.id
                }).save()
                user.password = undefined
                pubsub.publish('NEW_POST', {
                    newPost: post
                })
                return post
            } catch (error) {
                console.log(error)
            }
        },
        async deletePost(parent, args, context, info) {
            const user = checkAuth(context.req)
            try {
                const post = await Post.findById(args.id)
                if (!post) {
                    return new Error('Post not found')
                }
                if (post.username === user.username) {
                    await post.delete()
                    return 'Post deleted successfully'
                } else {
                    return new AuthenticationError('Action not allowed') 
                }
            } catch (error) {
                console.log(error)
            }
        },
        async toggleLikePost(parent, {postId}, {req}, info) {
            const {username} = checkAuth(req)
            try {
                const post = await Post.findById(postId)
                if (!post) {
                    return new Error('Post not found')
                }
                const like = post.likes.find(like => like.username === username)
                if (like) {
                    post.likes = post.likes.filter(like => like.username !== username)
                } else {
                    post.likes.push({
                        username,
                        createdAt: new Date().getTime().toString()
                    })
                }
                await post.save()
                return post
            } catch (error) {
                console.log(error)
            }
        }
    },
    Subscription: {
        newPost: {
            subscribe: (parent, args, {pubsub}, info) => pubsub.asyncIterator('NEW_POST') 
        }
    }
}