const PostModel = require('../models/post.model');
const PostController = {};

PostController.create = (req, res) => {
    return PostModel.createPost(req.body, (err, post) => {
        if (err) {
            return res.status(500).end();
        } else {
            return res.json(post);
        }
    })

};

PostController.update = (req, res) => {
    const postId = req.params.id;
    const updateData = req.body;

    PostModel.updatePost(postId, updateData, (err, updatedPost) => {
        if (err) {
            return res.status(500).end();
        } else {
            return res.json(updatedPost);
        }
    });
};

PostController.findPost = async (req, res) => {
    const postId = req.params.id;

    try {
        const foundPost = await PostModel.findPost(postId);
        
        if (!foundPost) {
            return res.status(404).end();
        }

        return res.json(foundPost);
    } catch (error) {
        console.error(error);
        return res.status(500).end();
    }
};

PostController.getAllPosts = (req, res) => {

};

module.exports = PostController;

