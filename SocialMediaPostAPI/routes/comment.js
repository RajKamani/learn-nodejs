const router = require('express').Router();
const CommentController = require('../controller/CommentController')

router.post('/:id/comment/create',CommentController.createComment);

module.exports = router

