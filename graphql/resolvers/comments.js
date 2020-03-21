const Post = require('../../models/Post')
const checkAuth = require('../../utilities/checkAuth')
const {UserInputError, AuthenticationError} = require('apollo-server')

module.exports = {
    Mutation: {
        async createComment(parent, args, {req}, info) {
            const user = checkAuth(req)
            const {postId, body} = args
            if (body.trim() === '') {
                throw new UserInputError('Empty comment body', {
                    errors: {
                        body: 'Comment body must be not empty'
                    }
                })
            }
            try {
                const post = await Post.findById(postId)
                if (!post) {
                    return new Error('Post not found')
                }
                post.comments = [
                    {
                        body,
                        username: user.username,
                        createdAt: new Date().getTime().toString()
                    },
                    ...post.comments
                ]
                await post.save()
                return post
            } catch (error) {
                console.log(error)
            }
        },
        async deleteComment(parent, {postId, commentId}, context, info) {
            const user = checkAuth(context.req)
            try {
                const post = await Post.findById(postId)
                if (!post) {
                    return new Error('Post not found')
                }
                const comment = post.comments.find(comment => comment.id === commentId)
                if (!comment) {
                    return new Error('Comment not found')
                }
                if (comment.username !== user.username) {
                    return new Error('You\'re not authorized')
                }
                post.comments = post.comments.filter(comment => comment.id !== commentId)
                await post.save()
                return post
            } catch (error) {
                console.log(error)
            }
        }
    }
}