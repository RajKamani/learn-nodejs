const router = require('express').Router();
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + file.originalname)
    }
  })
const upload = multer({storage:storage})

const PostController = require('../controller/PostController')

router.get('/',PostController.getAllPost);
router.get('/:id',PostController.getByid);
router.post('/create',upload.single('image'),PostController.createPost);
router.delete('/delete/:id',PostController.deleteByid);
router.patch('/update/:id',PostController.updateByid);

module.exports = router

