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

PostController.findPost = (req, res) => {

};

PostController.getAllPosts = (req, res) => {

};

module.exports = PostController;

