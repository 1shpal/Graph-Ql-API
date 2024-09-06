const Post = require('../../models/Post')
module.exports = {
    Query: {
        getPost :async ()=> {
            try {
                const posts = await Post.find()
                return posts
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}