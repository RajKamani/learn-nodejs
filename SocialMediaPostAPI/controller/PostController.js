const Post = require("../model/Post");

exports.createPost = (req, res) => {


  Post.create({
    title: req.body.title,
    user: req.user.id,
    description: req.body.description,
    imageLink:req.get('host')+'/'+req.file.path
  })
    .then((newPost) => res.status(200).send(newPost))
    .catch((err) => res.status(400).json({ err: err.message }));
};

exports.getAllPost = (req, res) => {
  Post.find()
    .sort({ createdAt: "desc" })
    .populate("user")
    .populate("comments")
    .then((newPost) => res.status(200).send(newPost))
    .catch((err) => res.status(400).json({ err: err.message }));
};
exports.getByid = (req, res) => {
  Post.findById({ _id: req.params.id })
    .then((newPost) => res.status(200).send(newPost))
    .catch((err) => res.status(400).json({ err: err.message }));
};

exports.deleteByid = (req, res) => {
  Post.findOneAndDelete({ _id: req.params.id, user: req.user.id })
    .then((delPost) => {
      if (!delPost) {
        res.status(401).json({ err: "This is not your Post." });
      }
      res.status(200).send(delPost);
    })
    .catch((err) => res.status(400).json({ err: err.message }));
};

exports.updateByid = (req, res) => {
  Post.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { $set: { title: req.body.title, description: req.body.description } },
    { new: true }
  )
    .then((updatedPost) => {
      if (!updatedPost) {
        res.status(200).send({ update: false, updatedPost });
      }
      res.status(200).send({ update: true, updatedPost });
    })
    .catch((err) => res.status(400).json({ err: err.message }));
};
