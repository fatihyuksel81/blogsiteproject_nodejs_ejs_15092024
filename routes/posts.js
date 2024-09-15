const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();
const postController = require('../controllers/postController');

router.get('/post', (req, res) => {
    const message = req.flash('message');
    if (req.session.userId) {
        res.render('post', {message});
    } else {
        res.redirect('/login');
    }
});
router.get('/', postController.showPost);
router.get('/posts/:id', postController.postDetail);
router.get('/my-posts/', postController.showMyPosts);
router.get('/edit-post/:id', postController.getEditMyPost);
router.get('/category/:category', postController.showPostByCategory);


router.post('/create-post', upload.single('file'), postController.addPost);
router.post('/edit-post/:id', postController.editMyPost);
router.post('/posts/:id/delete', postController.deleteMyPost);

module.exports = router;