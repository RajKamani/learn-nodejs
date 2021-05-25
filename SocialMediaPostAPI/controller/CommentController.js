const Comment = require("../model/Comment");
const Post = require("../model/Post");

exports.createComment = (req, res) => {
  Comment.create({
    commentText: req.body.commentText,
    user: req.user.id,
  })
    .then((comm) => {
        
      Post.findById({ _id: req.params.id })
        .then((post) => {
          post.comments.push(comm);
          post.save();
          res.status(401).json(post);
        })
        .catch((err) => res.status(401).json({ err: err.message }));
    })
    .catch((err) => res.status(401).json({ err: err.message }));
};
